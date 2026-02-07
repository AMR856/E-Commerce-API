const { ROLE_PERMISSIONS } = require("../config/roles");

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    const allowed = requiredPermissions.every((p) =>
      permissions.includes(p)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = authorize;
