var express = require('express');
var router = express.Router();

const uploadEstatuto = (req, estatuto) => {
    // upload file with unique name
    let timestamp = +new Date();
    let newFilename = `./public/uploads/estatutos/${timestamp}_estatuto_${estatuto.name}`
    estatuto.mv(newFilename);

    //generate public url
    return `${req.protocol}://${req.get('host')}${newFilename.replace('./public', '')}`;
}

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

router.post('/', (req, res) => {
    const newExpedient = {};
    // send to bonita

});

/* 
router.get('/', async (req, res, next) => {
    try {
        let { data: expedients, error } = await supabase
            .from('expedient')
            .select('*');
        if (error) { throw error;}
        res.json(expedients)
    } catch (error) {
        res.json(error);
    }
});

router.post('/', async (req, res, next) => {
    let expedientResolve, expedientFail, expedientPromise = new Promise((r, f) => {
        expedientResolve=r;
        expedientFail=f;
    });

    const newExpedient= {};
    // send to bonita

    try {
        let timestamp = +new Date();
        let file; // = event.target.files[0]

        const { dataUpload, errorUpload } = await supabase
            .storage
            .from('expedient-files')
            .upload(`public/file${timestamp}.png`, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (errorUpload) { throw errorUpload; }
        
        const { publicURL, errorPublicURL } = supabase
            .storage
            .from('expedient-files')
            .getPublicUrl(`public/file${timestamp}.png`);

        if (errorPublicURL) { throw errorPublicURL; }

        newExpedient.estatuto = publicURL;

        const { data, error } = await supabase.from('expedient').insert([ newExpedient ])
        if (error) { throw error; }

        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
 */




module.exports = router;
