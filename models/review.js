const { Schema, model } = require("mongoose");

const reviewSchema = Schema ({
    user : {type : Schema.Types.ObjectId, ref: 'User', require: true},
    userName : {type: String, require: true},
    comment: {type: String, trim: true},
    date : {type : Date, default: Date.now}
});

reviewSchema.set('toObject', {virtuals: true});
reviewSchema.set('toJSON', {virtuals: true});

exports.Review = model("Review", reviewSchema);