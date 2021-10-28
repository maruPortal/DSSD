var jwt = require("jsonwebtoken");
const supabase = require("../helpers/supabase");

exports.loginController = async (req, res) => {
  let { data: escribano, error } = await supabase
    .from("escribano")
    .select("*")
    // Filters

    .eq("username", req.body.username)
    .eq("password", req.body.password);

  if (error) {
    res.status(500).json(error);
    return;
  }
  if (escribano.length) {
    console.log(escribano);
    const payload = {
      check: true,
    };
    const token = jwt.sign(payload, "secretKey", {
      expiresIn: 1440,
    });
    res.json({
      mensaje: "Login existoso",
      token: token,
    });
  } else {
    console.log(escribano);
    res.json({
      mensaje: "Login Fallido",
    });
  }
};
