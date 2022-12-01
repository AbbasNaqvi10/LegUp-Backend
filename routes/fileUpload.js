var express = require("express")
var router = express.Router()
const morgan = require('morgan');
const multer= require('multer')
var jwt = require("jsonwebtoken")

require('dotenv').config();

const { fileUploaderForS3,forFileLocationOnly} = require('../methods/s3');
const { StoredFileLocation} = require('../methods/dynamo');

var app = express();

app.use(express.json());                            
app.use(morgan('dev'));


const storage = multer.memoryStorage()

const upload= multer({
    storage,
})


router.post('/', upload.array('file'), async (req, res, next) => {
    try {
        var myResults = await fileUploaderForS3(req.files)
        res.json({ myResults })
    }
    catch (err) { console.log(err) }
    const forFileLocationOnlyValue = await forFileLocationOnly(myResults, req.files)
    StoredFileLocation(req.files, forFileLocationOnlyValue)
})
module.exports = router;