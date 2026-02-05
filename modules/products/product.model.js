const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is a required field"],
    trim: true,
  },
  richDescrition: {
    type: String,
    default: "",
    trim: true,
  },
  image: {
    type: String,
    default: "",
    trim: true,
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: "",
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is a required field"],
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is a required field"],
  },
  countInStock: {
    type: Number,
    required: [true, "Count is a required field"],
    default: 0,
    min: 0,
    max: 1000,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000,
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dataCreated: {
    type: Date,
    default: Date.now
  }
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
