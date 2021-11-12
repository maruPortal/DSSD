const QRCode = require("qrcode");

module.exports = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url);
    return qrCode;
  } catch (err) {
    console.error(err);
  }
};
