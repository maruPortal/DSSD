const qrCodeGenerator = require("../helpers/qrGenerator");
const supabase = require("../helpers/supabase");

exports.showController = async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from("expedient")
      .select("*")
      .eq("hash", req.params.hash);
    let socios = expedients[0].socios.map(JSON.parse);
    if (error) {
      throw error;
    }
    qrCode = await qrCodeGenerator(
      `https://boiling-bastion-89555.herokuapp.com/show/${expedients[0].hash}`
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
