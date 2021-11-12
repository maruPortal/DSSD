var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var indexRouter = require("./routes/index");
var showRouter = require("./routes/show");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/show", showRouter);

module.exports = app;
