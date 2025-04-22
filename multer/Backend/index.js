const express = require('express')
const { upload } = require('./storage');
const path = require('path');
const multer = require('multer');
const { log } = require('console');
const cors = require('cors');

// const upload = multer({ dest: 'uploads/' })

const app = express()
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const folderLocation = path.join(__dirname, './uploads');
app.use(express.static(folderLocation));

let corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true

}
app.use(cors(corsOptions))
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.post("/Upload/File", upload.single("image"), (req, res) => {
//     log("Uploaded file:", req.file);
//     return res.json({ message: "File uploaded successfully", result: req.file });
// })


app.post("/Upload/Files", upload.array("images", 6), (req, res) => {
    log("Uploaded files:", req.files);

    return res.json({ message: "Files uploaded successfully",result: req.files });
})



// Error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                log("File size is too large. Max limit is 5MB");
                return res.status(400).json({ message: 'File size is too large. Max limit is 5MB' });
            // case 'LIMIT_UNEXPECTED_FILE':
            //     return res.status(400).json({ message: 'Too many files to upload' });
            default:
                return res.status(400).json({ message: 'Something went wrong' });
        }
    } else if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Something went wrong', error: err.message });
    }
    next();
})


// app.use((err, req, res, next) => {
//     console.error(err.message);
//     res.status(400).json({ error: err.message });
// });





app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})


