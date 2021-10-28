const jwt = require("jsonwebtoken");
const crypto = require("crypto");
exports.hashController = (req, res, next) => {
  let estatuto = req.body.estatuto;
  let username = req.body.username;
  let expediente = req.body.expediente;
  let hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(estatuto + username + expediente))
    .digest("hex");
  res.json({
    hash: hash,
  });
};

//Se utiliza string de estatuto+usuario+contraseña
