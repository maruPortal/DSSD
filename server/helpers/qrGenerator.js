const fetch = require("node-fetch");
const QRCode = require("qrcode");

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

module.exports = async (url) => {
  try {
    const qrCode = await QRCode.toDataURL(url);
    return qrCode;
  } catch (err) {
    console.error(err);
  }
};
