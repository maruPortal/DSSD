const express = require("express");
const protectedRoutes = express.Router();
var jwt = require("jsonwebtoken");

protectedRoutes.use((req, res, next) => {
  const token = req.headers["access-token"];

  if (token) {
    console.log("entraste a middleware");
    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        return res.json({ mensaje: "Token inválido" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: "Token no provisto.",
    });
  }
});

module.exports = {
  protectedRoutes,
};
