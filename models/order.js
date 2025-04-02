const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  shippingAddress: { type: String, require: true },
  city: { type: String, require: true },
  postalCode: String,
  country: { type: String, require: true },
  phone: { type: String, require: true },
  paymentId: String,
  status: {
    type: String,
    require: true,
    default: 'pending',
    enum: [
      "pending",
      "processed",
      "shipped",
      "out-for-delivery",
      "delivered",
      "cancelled",
      "on-hold",
      "expired",
    ],
  },
});

exports.Order = model("Order", orderSchema);
