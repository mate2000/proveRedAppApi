const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  createToken(user) {
    let privateKey = fs.readFileSync("api/config/private.key").toString();
    return jwt.sign(user, privateKey, { expiresIn: "1h" });
  },
  validToken(token) {
    let privateKey = fs.readFileSync("api/config/private.key").toString();
    return jwt.verify(token, privateKey);
  },
};
