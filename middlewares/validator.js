class Validator {
  static body(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({
          status: "Failed",
          errors: messages,
        });
      }

      next();
    };
  }

  static params(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.params, { abortEarly: false });

      if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({
          status: "Failed",
          errors: messages,
        });
      }

      next();
    };
  }
}

module.exports = new Validator();
