const {User} = require('../../models/user');
const {Order} = require('../../models/order');
const {OrderItem} = require('../../models/order_item');
const {CartProduct} = require('../../models/cart_product');
const {Token} = require('../../models/token');
exports.getUserCount = async function (_, res) {
  try {
    const userCount = await User.countDocuments();
    if (!userCount) {
      return res.status(500).json({ message: "Could not const users" });
    }
    return res.json({ userCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};


exports.deleteUser = async function (req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ user: userId });
    const orderItemIds = orders.flatMap((order) => order.orderItemIds);
    await Order.deleteMany({ user: userId });
    await OrderItem.deleteMany({ _id: { $in: orderItemIds } });

    await CartProduct.deleteMany({ _id: { $in: user.cart } });

    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { $exists: true } },
    });

    await Token.deleteOne({userId : userId});

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.addCategory = async function (req, res) {};
exports.editCategory = async function (req, res) {};
exports.deleteCategory = async function (req, res) {};

exports.getProduct = async function (req, res) {};
exports.addProduct = async function (req, res) {};
exports.editProduct = async function (req, res) {};
exports.deleteProductImages = async function (req, res) {};
exports.deleteProduct = async function (req, res) {};

exports.getOrders = async function (req, res) {};
exports.getOrdersCount = async function (req, res) {};
exports.changeOrderStatus = async function (req, res) {};
