const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const OAuth2Data = require("../credentials.json");
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris;
const REFRESH_TOKEN = OAuth2Data.web.refresh_token;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

const createFolder = async () => {
  var fileMetadata = {
    name: nanoid(),
    mimeType: "application/vnd.google-apps.folder",
  };
  return await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });
};

async function uploadFile(fileName) {
  try {
    const {
      data: { id },
    } = await createFolder();
    const filePath = path.join(
      __dirname,
      "..",
      `/public/uploads/estatutos/${fileName}`
    );
    var fileMetadata = {
      name: `${nanoid()}.pdf`,
      parents: [id],
    };
    var media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          createLink(file.data.id);
          console.log("FILE CREATED!! File Id: ", file.data.id);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function createLink(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink,webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
  }
}
//Se llama al metodo uploadFile con el nombre del archivo ubicado en el folder
//public/uploads/estatutos
//Se crea la carpeta y se genera link para compatir
uploadFile("DSSDFinal.pdf");
