import AWS from "aws-sdk";
// import fs from "fs";
import dotenv from "dotenv";

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

//Upload file to S3
const uploadFileToS3 = async (imageFile, id) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${id}/${imageFile.originalname}`,
    Body: imageFile.buffer,
    ContentType: imageFile.mimetype,
    ACL: "public-read",
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload image to S3");
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

export { uploadFileToS3, getImagesFromS3 };
