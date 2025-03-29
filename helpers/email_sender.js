const modemailer = require("nodemailer");

exports.sendEmail = async (email, subject, body) => {
  return new Promise((resolve, reject) => {
    const transporter = modemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        reject(Error("Error sending email"));
      }
      resolve("Password reset OTP sent to your email", info);
    });
  });
};
