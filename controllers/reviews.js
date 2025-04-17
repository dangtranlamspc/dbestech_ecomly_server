const {User} = require('../models/user');
const {Product} = require('../models/product');
const {Review} = require('../models/review');

exports.leaveReview = async function (req, res) {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const review = await new Review({
      ...req.body,
      userName: user.name,
    });

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.reviews.push(review.id);
    product = await product.save();
    if (!product) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    review = await review.save();

    if (!review) {
      return res.status(500).json({ message: "Product review failed" });
    }
    return res.status(201).json({ product, review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.getProductReviews = async function (req, res) {};
