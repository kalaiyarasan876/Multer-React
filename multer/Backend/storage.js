const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (_req, file, cb) {
        cb(null, file.fieldname + '-' + `${uuidv4()}` + path.extname(file.originalname));
    }
});


const checkFileType = ((req, file, cb) => {
    const filetypes = /^(image\/(jpeg|jpg|png|gif|webp|bmp|tiff|svg)|video\/(mp4|avi|mkv|mov|wmv|flv|webm)|audio\/(mp3))$/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, MP3, and common video formats are allowed.'), false);
    }
});


exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,

    },
    fileFilter: checkFileType,
});


