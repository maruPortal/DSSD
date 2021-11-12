var express = require("express");
var router = express.Router();
const supabase = require("../helpers/supabase");
const qrCodeGenerator = require("../helpers/qrGenerator");

const { showController } = require("../controllers/show");

router.get("/:hash", showController);

module.exports = router;
