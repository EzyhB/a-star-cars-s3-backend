import AWS from "aws-sdk";
import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const bucketName = process.env.THE_BUCKET_NAME;
const region = process.env.THE_BUCKET_REGION;
const accessKeyID = process.env.THE_ACCESS_KEY;
const secretAccessKey = process.env.THE_SECRET_KEY;

const s3 = new AWS.S3({
  region: region,
  accessKeyId: accessKeyID,
  secretAccessKey: secretAccessKey,
});

const uploadMulter = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${req.params.id}/${file.originalname}`);
    },
  }),

  fileFilter: function (request, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  },
  // Set boundary option here
  preservePath: true,
  boundary: "----WebKitFormBoundary7MA4YWxkTrZu0gW",
});

export { uploadMulter };
