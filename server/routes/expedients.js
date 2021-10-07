var express = require('express');
var router = express.Router();
const Bonita = require('../model/bonita');
const supabase = require('../helpers/supabase');


const uploadEstatuto = (req, estatuto) => {
    // upload file with unique name
    let timestamp = +new Date();
    let newFilename = `./public/uploads/estatutos/${timestamp}_estatuto_${estatuto.name}`
    estatuto.mv(newFilename);

    //generate public url
    return `${req.protocol}://${req.get('host')}${newFilename.replace('./public', '')}`;
}


/* 
  // Note: Beware to set encType="multipart/form-data" on the <form />
  // POST localhost:3000/expedients/upload-estatuto
  // body { estatuto: FILE }
  router.post('/upload-estatuto', async (req, res) => {
      try {
          if (!req.files) {
              res.json({ status: false, message: 'No file uploaded', publicURL: null });
          } else {
              res.json({ status: true, message: 'File uploaded', publicURL: uploadEstatuto(req, req.files.estatuto) });
          }
      } catch (err) {
          console.log(err);
          res.status(500).json(err);
      }
  });
 */


// Note: Beware to set encType="multipart/form-data" on the <form />
// POST localhost:3000/expedients/
/**
 * NOTE working supabase
 * body:
{
  "nombreSociedad": "DSSD 2",
  "apoderado": "yo",
  "domicilioLegal": "calle wallaby 42 sidney",
  "domicilioReal": "calle wallaby 42 sidney",
  "emailApoderado": "gaston.ambrogi@gmail.com",
  "estado": "0",
  "estatuto": "URL",
  "paises": ["ARG","UY","BR"],
  "socios": ["JoseMi","Maru"]
}

files: {
  estatuto: FILE
}
*/

router.post('/', async (req, res) => {
  let tmpExpedient = {...req.body};
  // validaciones de BE
  tmpExpedient.estatuto = uploadEstatuto(req, req.files.estatuto);

  const { expedient, error } = await supabase.from('expedient').insert([tmpExpedient]);

  if (error) {
    res.status(500).json(error);
    return;
  }

  /* let bonitaUser = await Bonita.login();
      // const dataAllProcesses = await bonitaUser.getAllProcesses();
      // // console.log(dataAllProcesses);
  
      await bonitaUser.getProcessID('Sociedades');
      const initBonitaProc = await bonitaUser.initiateProcess();
      console.log(initBonitaProc);
  
      // const data = await bonitaUser.postCase( expediente )
   */

  res.json(expedient);
});

router.get('/', async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from('expedient')
      .select('*');
    if (error) { throw error; }
    res.json(expedients)
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
