const { Product } = require("../../models/product");
const media_helper = require("../../helpers/media_helper");
const util = require("util");
const { Category } = require("../../models/category");

exports.getProductsCount = async function (req, res) {
  try {
    const productCount = await Product.countDocuments();
    if (!productCount) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({ count: productCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.getProduct = async function (req, res) {
  try {
    const uploadImage = util.promisify(
      media_helper.upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ])
    );
    try {
      await uploadImage(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: error.code,
        message: `${error.message}{${error.field}}`,
        storageErrors: error.storageErrors,
      });
    }
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.addProduct = async function (req, res) {};

exports.editProduct = async function (req, res) {};

exports.deleteProductImages = async function (req, res) {};

exports.deleteProduct = async function (req, res) {};
