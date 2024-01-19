const formidable = require('formidable');
const express = require('express');
const app = express();

const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "do9lunhhd",
  api_key: "587737212289234",
  api_secret: "h7E4fZD759Coxxtp79pt5dh3Zak"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const form = formidable({
        multiples: true
    });

    form.parse(req, async (err, fields, files) => {
        const productId = fields.productId || 'defaultProductId';

        let imgInfo = [];

        if (Array.isArray(files.file)) {
            imgInfo = files.file.map((file) => { return { filePath: file.filepath, id: file.newFilename } });
        } else {
            imgInfo.push({ filePath: files.file.filepath, id: files.file.newFilename });
        }

        for (const file of imgInfo) {
            try {
                const result = await cloudinary.uploader.upload(file.filePath, { public_id: file.id, folder: fields.folder || "hai" });
                console.log(`Product ID: ${productId}`);
                console.log(`Public ID for ${file.id}: ${result.public_id}`);
                console.log(`Secure URL for ${file.id}: ${result.secure_url}`);
                // You can save productId, result.public_id, and result.secure_url to your database or perform other operations here.
            } catch (error) {
                console.error(`Error uploading ${file.id}: ${error.message}`);
            }
        }

        res.send('Images uploaded successfully');
    });
});

app.listen(3001, () => {
    console.log('Server listening on http://localhost:3001/');
});
