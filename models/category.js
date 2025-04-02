const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  name: { type: String, require: true },
  colour: { type: String, default: "#000000" },
  image: { type: String, require: true },
  markedForDeletion: {type : Boolean, default : false},
});

exports.Category = model('Category', categorySchema);
