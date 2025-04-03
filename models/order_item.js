const {Schema, model} = require('mongoose');

const orderItemSchema = Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product', require: true},
    productName: {type: String, require: true},
    productImage: {type: String, require: true},
    productPrice: {type: Number, require: true},
    quantity: {type: Number, default: 1},
    selectedSize: String,
    selectedColour : String,
});

orderItemSchema.set('toObject', {virtuals: true});
orderItemSchema.set('toJSON', {virtuals: true});

exports.orderItem = model('OrderItem', orderItemSchema);