require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
});

const uploadImage = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            const timestamp = Date.now();
            const s3Path = `thumbnail/${basename}_${timestamp}${ext}`;
            req.thumbnail = s3Path;
            cb(null, s3Path);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).single('thumbnail');

const uploadImageList = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            const timestamp = Date.now();
            const s3Path = `board/${basename}_${timestamp}${ext}`;
            if (!req.images) {
                req.images = [];
            }
            req.images.push({ order: req.images.length, s3Path });
            cb(null, s3Path);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).array('images', 5);

module.exports = { uploadImage, uploadImageList };
