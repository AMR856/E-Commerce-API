const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.selectionStr = "-passwordHash -__v";
  }

  async createUser(data) {
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

  async getAllUsers() {
    const users = await User.find().select(this.selectionStr);
    return users;
  }

  async getUserById(id) {
    return await User.findById(id).select(this.selectionStr);
  }

  async getUserCount() {
    return await User.countDocuments();
  }

  async deleteUserById(id) {
    return await User.findByIdAndDelete(id);
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) throw new Error("Wrong password");

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { email: user.email, token };
  }
}

module.exports = UserService;
