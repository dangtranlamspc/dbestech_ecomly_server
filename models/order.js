const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  orderItems: [{type: Schema.Types.ObjectId, ref : 'OrderItem', require: true}] ,
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
  statusHistory : {
    type : [String],
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
    require: true,
    default : ['pending'],
  },
  totalPrice : Number,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  dateOrdered: {type: Date, default: Date.now},
});

orderSchema.set('toObject', {virtuals: true});
orderSchema.set('toJSON', {virtuals: true});

exports.Order = model('Order', orderSchema);
