const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  slug: { type: String, unique: true },
  description: { type: String },
  color: {
    type: String,
    trim: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
