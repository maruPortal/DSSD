var express = require("express");
var router = express.Router();
const { loginController } = require("../controllers/login");
const { hashController } = require("../controllers/hash");
const { protectedRoutes } = require("../middleware/protectedRoutes");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.post("/login", loginController);

router.post("/estampillar", protectedRoutes, hashController);
module.exports = router;
