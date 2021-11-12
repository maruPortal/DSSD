const qrCodeGenerator = require("../helpers/qrGenerator");
const supabase = require("../helpers/supabase");

exports.showProfile = async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from("expedient")
      .select("*")
      .eq("id", req.params.id);
    let socios = expedients[0].socios.map(JSON.parse);
    if (error) {
      throw error;
    }
    qrCode = await qrCodeGenerator(
      `https://afternoon-falls-22500.herokuapp.com/expedients/show/${expedients[0].hash}`
    );
    if (expedients.length > 0) {
      res.render("show", {
        expedients: expedients[0],
        socios: socios,
        qrCode: qrCode,
      });
    } else {
      res.status(404).json(expedients);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
