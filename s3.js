import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.THE_BUCKET_NAME;
const region = process.env.THE_BUCKET_REGION;
const accessKeyID = process.env.THE_ACCESS_KEY;
const secretAccessKey = process.env.THE_SECRET_KEY;

// AWS.config.update({
//   accessKeyId: "your-access-key-id" astarcarsales-bucket,
//   secretAccessKey: "your-secret-access-key",
// });

const s3 = new AWS.S3({
  region: region,
  accessKeyId: accessKeyID,
  secretAccessKey: secretAccessKey,
});

// Set up multer-s3 middleware
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "astarcarsales-bucket",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, req.params.id + "/" + file.originalname);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

//Upload file to S3
const uploadImage = async (files, id) => {
  //   const folderName = id.toString();
  //   const uploadPromises = files.map((file) => {
  //     const fileStream = fs.createReadStream(file.path);
  //     const key = `${folderName}/${file.originalname}`; // add the folder name "uploads" and the ID to the S3 key
  //     const uploadParams = {
  //       Bucket: bucketName,
  //       Body: fileStream,
  //       Key: key,
  //     };
  //     return s3.upload(uploadParams).promise();
  //   });
  //   const results = await Promise.all(uploadPromises);
  //   return results;
};

// Route handler for POST /api/images/:id
const postImageToS3Multer = async (req, res) => {
  try {
    // Get the images from the request
    const ID = req.params.id;

    if (!req.headers["content-type"].includes("multipart/form-data")) {
      console.log("Invalid request format, expected multipart/form-data.");

      return res.status(400).send({
        message: "Invalid request format, expected multipart/form-data.",
      });
    }

    // Use multer-s3 middleware to upload the files to S3
    upload.array("images[]")(req, res, async function (err) {
      if (err) {
        console.log("Error uploading images:", err);
        return res.status(500).send({ message: "Error uploading images." });
      }

      const uploadedFiles = req.files.map((file) => {
        return {
          filename: file.originalname,
          url: file.location,
        };
      });

      res.status(200).json({
        message: "Uploaded files:",
        payload: uploadedFiles,
      });
    });
  } catch (error) {
    console.error("error here", error);
    res
      .status(500)
      .send({ message: "An error occurred while processing the request." });
  }
};

//Download file from S3
const getImagesFromS3 = async (req, res) => {
  const ID = req.params.id.toString();

  const listParams = {
    Bucket: bucketName,
    Prefix: ID,
  };

  try {
    const data = await s3.listObjectsV2(listParams).promise();

    const objects = data.Contents;

    objects.forEach((obj) => {
      const s3Stream = s3
        .getObject({ Bucket: listParams.Bucket, Key: obj.Key })
        .createReadStream();
      s3Stream.pipe(res);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "An error occurred while processing the request.",
      error: err,
    });
  }
};

export { uploadImage, getImagesFromS3, postImageToS3Multer };
