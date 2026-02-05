const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required : [true, 'Name is a Required field'],
    trim: true
  },
  email: {
    type: String,
    required : [true, 'Email is a Required field'],
    trim: true
  }, 
  passwordHash: {
    type: String,
    required : [true, 'Password is a required field'],
    trim: true
  },
  street: {
    type: String,
    default: '',
    trim: true
  },
  apartment: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  zip: {
    type: String,
    default: '',
    trim: true
  },
  country: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
