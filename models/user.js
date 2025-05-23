const { Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    street : String,
    apartment: String,
    city: String,
    postalCode: String,
    country: String,
    phone : {type: String, required: true, trim : true},
    isAdmin: { type: Boolean, default: false },
    resetPasswordOtp : Number,
    resetPasswordOtpExpire : Date,
    wishList: [
        {
            productId : {type : Schema.Types.ObjectId, ref : 'Product'},
            productName: {type: String, required: true},
            productImage: {type: String, required: true},
            productPrice: {type: Number, required: true},
        }
    ],
});

userSchema.index({email: 1}, {unique: true});

exports.User = model('User', userSchema);
