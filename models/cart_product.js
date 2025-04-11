const { Schema, model } = require("mongoose");

const cartProductSchema = Schema ({
    product : {type: Schema.Types.ObjectId, ref : 'Product', require: true},
    quantity : {type: Number, default: 1},
    selectedSize: String,
    selectedColour : String,
    productName: {type: String, require: true},
    productImage: {type: String, require: true},
    productPrice: {type: Number, require: true},
    reservationExpiry : {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000),
    },
    reserved : { type : Boolean, require: true},
});

cartProductSchema.set('toObject', {virtuals: true});
cartProductSchema.set('toJSON', {virtuals : true}),

exports.CartProduct = model('CartProduct', cartProductSchema);