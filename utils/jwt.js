const { expressjwt: jwt } = require("express-jwt");

// http://localhost:3000/api-docs/
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
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api-docs(.*)/, methods: ["GET"] },
      `${apiURL}/users/login`,
      `${apiURL}/users/register`,
    ],
  });
};

async function isRevoked() {
  return false;
}

module.exports = authJwt;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThhNTQ0MzYxNzIwMWZmZWJjMDE2YmUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzA2NzMyMzIsImV4cCI6MTc3MDc1OTYzMn0.Rl91Kay4ZZ-LGkb7Ud4jxXLafGoszpHTmyzDBxp8Th8