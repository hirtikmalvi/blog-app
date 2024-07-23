const { validateToken } = require("../services/authentication");

const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    const tokenAsCookieValue = req.cookies[cookieName];
    if (!tokenAsCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenAsCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
};

module.exports = {
  checkForAuthenticationCookie,
};
