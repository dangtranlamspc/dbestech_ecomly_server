const cron = require("node-cron");
const { Category } = require("../models/category");
const { Product } = require("../models/product");
const { default: mongoose } = require("mongoose");
const { CartProduct } = require("../models/cart_product");

cron.schedule("0 0 * * *", async function () {
  try {
    const categoriesToBeDeleted = await Category.find({
      markedForDeletion: true,
    });
    for (const category of categoriesToBeDeleted) {
      const categoryProductsCount = await Product.countDocuments({
        category: category.id,
      });
      if (categoryProductsCount < 1) await category.deletedOne();
    }
    console.log("CRON job conpleted at", new Date());
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});

cron.schedule("*/30 * * * *", async function (req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Reservation Release CRON job started at", new Date());
    const expiredReservations = await CartProduct.find({
      reserved: true,
      reservationExpiry: { $lte: new Date() },
    }).session(session);
    for (const cartProduct of expiredReservations) {
      const product = await Product.findById(cartProduct.product).session(
        session
      );

      if (product) {
        const updateProduct = await Product.findByIdAndUpdate(
          product._id,
          { $inc: { quantity: cartProduct.quantity } },
          { new: true, runValidators: true, session }
        );

        if (!updateProduct) {
          console.error(
            "Error Occurred: Product update failed. Postential concurrency issue."
          );
          await session.abortTransaction();
          return;
        }

        await CartProduct.findByIdAndUpdate(
          cartProduct._id,
          { reserved: false },
          { session }
        );
      }
    }

    await session.commitTransaction();

    console.log("Reservation release CRON job completed at", new Date());
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
});
