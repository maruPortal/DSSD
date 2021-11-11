const fetch = require("node-fetch");

var options = {
  method: "POST",
  url: "https://neutrinoapi-qr-code.p.rapidapi.com/qr-code",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "x-rapidapi-host": "neutrinoapi-qr-code.p.rapidapi.com",
    "x-rapidapi-key": "306773702fmsh0b165c6e3cbdbb2p113ffbjsne7b643e1c1b9",
  },
  data: {
    "bg-color": "#ffffff",
    "fg-color": "#000000",
    height: "128",
    width: "128",
    content: "http://www.google.es",
  },
};

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

const qrCode = async function pepito() {
  return await fetch(options.url, {
    method: options.method,
    headers: options.headers,
    body: options.data,
  });
};

module.exports = qrCode;
