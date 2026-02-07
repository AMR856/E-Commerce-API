const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomError = require("../../utils/customError");
const HTTPStatusText = require('../../utils/HTTPStatusText');

class UserService {
  static selectionStr = "-passwordHash -__v";

  static async getAll() {
    const users = await User.find().select(this.selectionStr);
    return users;
  }

  static async getOne(id) {
    return await User.findById(id).select(this.selectionStr);
  }

  static async getCount() {
    return await User.countDocuments();
  }

  static async create(data) {
    const user = new User({
      name: data.name,
      email: data.email,
      passwordHash: bcrypt.hashSync(data.password, 10),
      street: data.street || "",
      apartment: data.apartment || "",
      city: data.city || "",
      zip: data.zip || "",
      country: data.country || "",
      phone: data.phone || "",
      isAdmin: data.isAdmin || false,
    });
    return await user.save();
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Invalid email or password", 401, HTTPStatusText.FAIL);
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      throw new CustomError("Invalid email or password", 401, HTTPStatusText.FAIL);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { email: user.email, token };
  }
  static async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select(this.selectionStr);
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404, HTTPStatusText.FAIL);
    }

    const isValid = bcrypt.compareSync(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new CustomError("Old password is incorrect", 401, HTTPStatusText.FAIL);
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    await user.save();
  }

  static async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserService;
