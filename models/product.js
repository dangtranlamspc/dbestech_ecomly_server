const { Schema, model } = require("mongoose");

const productSchema = Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  rating: { type: Number, default: 0.0 },
  colours: [{ type: String }],
  image: { type: String, require: true },
  images: [{ type: String }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  numberOfReview: { type: Number, default: 0 },
  sizes: [{ type: String }],
  category: { type: Schema.Types.ObjectId, ref: "Category", require: true },
  genderAgeCategory: { type: String, enum: ["men", "women", "unisex", "kids"] },
  countInStock: { type: String, require: true, min: 0, max: 255 },
  dateAdded: { type: Date, default: Date.now },
});

productSchema.pre("save", async function (next) {
  if (this.reviews.length > 0) {
    await this.populate("reviews");

    const totalRating = this.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    this.rating = totalRating / this.reviews.length;
    this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
    this.numberOfReview = this.reviews.length;
  }
  next();
});

productSchema.index({ name: "text", description: "text" });

// productSchema.virtual("productInitial").get(function () {
//   return this.firstBit + this.secondBit;
// });

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

exports.Product = model("Product", productSchema);
