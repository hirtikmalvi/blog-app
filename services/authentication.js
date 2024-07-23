const JWT = require("jsonwebtoken");

const SECRET = "H!rt!k@434";

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
  const token = JWT.sign(payload, SECRET);
  return token;
};

const validateToken = (token) => {
  const payload = JWT.verify(token, SECRET);
  return payload;
};

module.exports = {
  createTokenForUser,
  validateToken,
};
