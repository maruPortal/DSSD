var express = require("express");
var router = express.Router();

router.gest("/expedients/show/:hash", showController);
