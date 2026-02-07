const { expressjwt: jwt } = require("express-jwt");

const authJwt = function authJwt() {
  const secret = process.env.JWT_SECRET;
  const apiURL = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    requestProperty: "user",
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
      `${apiURL}/users/login`,
      `${apiURL}/users/register`,
    ],
  });
};

async function isRevoked() {
  return false;
}

module.exports = authJwt;
