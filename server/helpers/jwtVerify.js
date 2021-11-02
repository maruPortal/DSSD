var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers['auth'];

  if (token) {
    jwt.verify(token, "BONITA_SECRET_KEY", (err, userPayload) => {
      if (err) {
        return res.status(401).json({ message: 'invalid token' });
      } else {
        req.__jwtUserPayload = userPayload;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'missing token'});
  }
};