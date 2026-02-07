const userService = require("./user.service");

class UserController {

  static async getMe(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.userId);
      res.json({ status: "Success", user });
    } catch (err) {
      next(err);
    }
  }
  static async getAll(_, res, next) {
    try {
      const users = await userService.getAll();

      if (users.length === 0) {
        return res
          .status(200)
          .json({ status: "Success", message: "No users yet" });
      }

      res.status(200).json({ status: "Success", data: users });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const user = await userService.getOne(req.params.id);
      res.status(200).json({ status: "Success", user });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(_, res, next) {
    try {
      const count = await userService.getUserCount();
      res.status(200).json({ status: "Success", count });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ status: "Success", user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await userService.login(
        req.body.email,
        req.body.password,
      );

      res.status(200).json({ status: "Success", ...result });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res
        .status(200)
        .json({ status: "Success", message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.status(200).json({ status: "Success", user });
    } catch (err) {
      next(err);
    }
  }
  static async changePassword(req, res, next) {
    try {
      await userService.changePassword(
        req.user.userId,
        req.body.oldPassword,
        req.body.newPassword,
      );
      res.status(200).json({ status: "Success", message: "Password updated" });
    } catch (err) {
      next(err);
    }
  }
  static async logout(_, res) {
    res.status(200).json({ status: "Success", message: "Logged out" });
  }
}

module.exports = UserController;
