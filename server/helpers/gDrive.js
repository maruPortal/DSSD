const { google } = require("googleapis");
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

const createFolder = async (expedientID) => {
  var fileMetadata = {
    name: `expedient_${expedientID}`,
    mimeType: "application/vnd.google-apps.folder",
  };
  return await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });
};

async function uploadFile(expedientID, file) {
  let resolveUpload,rejectUpload;
  const prom = new Promise( (resolve, reject)=> {
    resolveUpload = resolve;
    rejectUpload=reject;
  })

  try {
    const {
      data: { id },
    } = await createFolder(expedientID);
    
    var fileMetadata = {
      name: `${nanoid()}.pdf`,
      parents: [id],
    };
    var media = {
      // mimeType: "application/pdf",
      body: file,
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      async function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
          rejectUpload(err);
        } else {
          const linkResult = await createLink(file.data.id);
          // console.log("FILE CREATED!! File Id: ", file.data.id);
          resolveUpload(linkResult);
        }
      }
    );
  } catch (err) {
    console.log(err);
    rejectUpload(err)
  }
  return prom;
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
    // console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}
//Se llama al metodo uploadFile con el nombre del archivo ubicado en el folder
//public/uploads/estatutos
//Se crea la carpeta y se genera link para compatir

// const fileName = "des.pdf";
// const filePath = path.join(
//   __dirname,
//   "..",
//   `/public/uploads/estatutos/${fileName}`
// );
// const file = fs.createReadStream(filePath);
// console.log(file);


// const upload = async () => {
//   const response = await fetch('http://localhost:3000/uploads/estatutos/1636991456920_estatuto_ab_des.pdf');
//   uploadFile(response.body);
// }

// upload();


module.exports = uploadFile;