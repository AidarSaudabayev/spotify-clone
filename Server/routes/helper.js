const jwt = require("jsonwebtoken");

const authentificateJWT = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, "test", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
};
module.exports = {
  authentificateJWT,
};