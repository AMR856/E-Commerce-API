const userService = require("./user.service");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class UserController {
  static async getMe(req, res, next) {
    try {
      const user = await userService.getOne(req.user.id);
      res.json({ status: HTTPStatusText.SUCCESS, user });
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
          .json({ status: HTTPStatusText.SUCCESS, message: "No users yet" });
      }

      res.status(200).json({ status: HTTPStatusText.SUCCESS, data: users });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const user = await userService.getOne(req.params.id);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, user });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(_, res, next) {
    try {
      const count = await userService.getCount();
      res.status(200).json({ status: HTTPStatusText.SUCCESS, count });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ status: HTTPStatusText.SUCCESS, user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await userService.login(req.body.email, req.body.password);

      res.status(200).json({ status: HTTPStatusText.SUCCESS, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res
        .status(200)
        .json({
          status: HTTPStatusText.SUCCESS,
          message: "User deleted successfully",
        });
    } catch (err) {
      next(err);
    }
  }
  static async update(req, res, next) {
    try {
      const userId = req.params.id || req.user.id;
      const role = req.user.role;
      const user = await userService.update(userId, req.body, role);

      res.status(200).json({ status: HTTPStatusText.SUCCESS, user });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      await userService.changePassword(
        req.user.id,
        req.body.oldPassword,
        req.body.newPassword,
      );
      res
        .status(200)
        .json({ status: HTTPStatusText.SUCCESS, message: "Password updated" });
    } catch (err) {
      next(err);
    }
  }
  static async logout(_, res) {
    res
      .status(200)
      .json({ status: HTTPStatusText.SUCCESS, message: "Logged out" });
  }
}

module.exports = UserController;
