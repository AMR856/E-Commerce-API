const userService = require("./user.service");

const postUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ status: "Success", user });
  } catch (err) {
    next(err);
  }
};


const getAllUsers = async (_, res, next) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return res
        .status(200)
        .json({ status: "Success", message: "No users yet" });
    }
    res.status(200).json({ status: "Success", data: users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ status: "Success", user });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await userService.loginUser(
      req.body.email,
      req.body.password,
    );
    res.status(200).json({ status: "Success", ...result });
  } catch (err) {
    next(err);
  }
};

const getCount = async (_, res, next) => {
  try {
    const count = await userService.getUserCount();
    res.status(200).json({ status: "Success", count });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res
      .status(200)
      .json({ status: "Success", message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postUser,
  getAllUsers,
  getUser,
  loginUser,
  getCount,
  deleteUser,
};
