var express = require("express");
var router = express.Router();
const Bonita = require("../model/bonita.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//Ruta para comprobar metodos de la API mediante metodo TestALL
router.get("/testAPI", function (req, res, next) {
  Bonita.testAll();
  res.render("index", { title: "Express" });
});

module.exports = router;
