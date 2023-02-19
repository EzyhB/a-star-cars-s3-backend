import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyID = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// AWS.config.update({
//   accessKeyId: "your-access-key-id",
//   secretAccessKey: "your-secret-access-key",
// });

const s3 = new AWS.S3({
  region: region,
  accessKeyId: accessKeyID,
  secretAccessKey: secretAccessKey,
});

//Upload file to S3
const uploadImage = async (files, id) => {
  const folderName = id.toString();
  const uploadPromises = files.map((file) => {
    const fileStream = fs.createReadStream(file.path);
    const key = `${folderName}/${file.originalname}`; // add the folder name "uploads" and the ID to the S3 key

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: key,
    };

    return s3.upload(uploadParams).promise();
  });

  const results = await Promise.all(uploadPromises);

  return results;
};

//Download file from S3
const getImagesFromS3 = (folderKey) => {
  const listParams = {
    Bucket: bucketName,
    Prefix: folderKey,
  };

  const images = [];

  s3.listObjectsV2(listParams, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    data.Contents.forEach((obj) => {
      const downloadParams = {
        Key: obj.Key,
        Bucket: bucketName,
      };

      const imageUrl = s3.getSignedUrl("getObject", downloadParams);
      images.push(imageUrl);
    });

    // console.log(images);
  });

  return images;
};

export { uploadImage, getImagesFromS3 };
