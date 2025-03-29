const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Token } = require("../models/token");
const mailSender = require("../helpers/email_sender");

exports.register = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()});
    const errorMessage = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessage });
  }
  try {
    let user = new User({
      ...req.body,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
    });

    user = await user.save();
    if (!user) {
      return res.status(500).json({
        type: "Internal Server Error",
        message: "The user cannot be created",
      });
    }

    return res.status(201).json(user);
  } catch (error) {
    if (error.message.includes("email_1 dup key")) {
      return res.status(409).json({
        type: "AuthError",
        message: "User with that email already exitst.",
      });
    }
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({
          type: "AuthError",
          message: "User not found, check your email or password and try again",
        });
    }

    if (!bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(400).json({ message: "Incorrect password !" });
    }

    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "60h" }
    );

    const token = await Token.findOne({ userId: user.id });
    if (token) await token.deleteOne();
    await new Token({
      userId: user.id,
      accessToken,
      refreshToken,
    }).save();

    user.passwordHash = undefined;
    return res.status(200).json({ ...user._doc, accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.verifyToken = async function (req, res) {
  try {
    let accessToken = req.headers.authorization;
    if (!accessToken) res.json(false);
    accessToken = accessToken.replace("Bearer", "").trim();

    const token = await Token.findOne({ accessToken });
    if (!token) return res.json(false);

    const tokenData = jwt.json(token.refreshToken);

    const user = await User.findById(tokenData.id);
    if (!user) return res.json(false);

    const isValid = jwt.verify(
      token.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!isValid) return res.json(false);

    return res.json(true);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that email does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 9000);
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 600000;
    await user.save();

    const response = await mailSender.sendEmail(
        email,
        "Password Reset OTP",
        `Your password reset OTP is ${otp}`,
    );
    return res.json({message: response});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.verifyPasswordResetOTP = async function (req, res) {
  try {
    const {email, otp} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that email does not exist" });
    }
    if (user.resetPasswordOtp !== +otp || Date.now() > user.resetPasswordOtpExpire) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    user.resetPasswordOtp = 1;
    user.resetPasswordOtpExpire = undefined;
    await user.save();
    return res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
    
  }
};

exports.resetPassword = async function (req, res) {
  try {
    const {email, newPassword} = req.body;
    const user = await User.findOne ({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that email does not exist" });
    }
    if (user.resetPasswordOtp !== 1) {
      return res.status(401).json({ message: "Confirm OTP before resetting password" });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save();
    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};
