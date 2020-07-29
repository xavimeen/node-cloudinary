const {Router} = require('express');
const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

const router = Router();
try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
} catch (error) {
    console.error(error)
}

router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find().lean();
        res.render('images', {photos});
    } catch (error) {
        console.error(error);
        res.status(500).json({messageError: 'Ocurrió un error en el servidor'});
    }
});

router.get('/images/add', async (req, res) => {
    try {
        const photos = await Photo.find().lean();
        res.render('image-form', {photos});
    } catch (error) {
        console.error(error);
        res.status(500).json({messageError: 'Ocurrió un error en el servidor'});
    }
});

router.post('/images/add', async (req, res) => {
    try {
        const {title, description} = req.body;
        const result = await cloudinary.v2.uploader.upload(req.file.path); // Subo la img que procesa multer a Cloudinary
    
        const newPhoto = new Photo({
            title,
            description,
            imageUrl: result.url,
            public_id: result.public_id
        });
    
        const photoSaved = await newPhoto.save();
        await fs.unlink(req.file.path); // Elimino el archivo de mi servidor
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({messageError: 'Ocurrió un error en el servidor'});
    }

});

router.get('/images/delete/:photo_id', async (req, res) => {
    try {
        const {photo_id} = req.params;
        const photoDeleted = await Photo.findByIdAndDelete(photo_id);
        const result = await cloudinary.v2.uploader.destroy(photoDeleted.public_id);
        console.log(result);
        res.redirect('/images/add');
    } catch (error) {
        console.error(error);
        res.status(500).json({messageError: 'Ocurrió un error en el servidor'});
    }
});

module.exports = router;