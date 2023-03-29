import { Upload } from "@aws-sdk/lib-storage";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.THE_BUCKET_NAME;
const region = process.env.THE_BUCKET_REGION;
const accessKeyID = process.env.THE_ACCESS_KEY;
const secretAccessKey = process.env.THE_SECRET_KEY;

const s3 = new S3Client({
  region: region,
  credentials: fromIni({
    accessKeyId: accessKeyID,
    secretAccessKey: secretAccessKey,
  }),
});

//Upload file to S3
const uploadFileToS3 = async (imageFile, id) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${id}/${imageFile.originalname}`,
    Body: imageFile.buffer,
    ContentType: `multipart/form-data; boundary=${imageFile.boundary}`,
    ACL: "public-read",
  };

  try {
    const upload = new Upload({
      client: s3,
      params: params,
    });

    const { Location } = await upload.done();
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
    const command = new ListObjectsV2Command(listParams);
    const data = await s3.send(command);

    const objects = data.Contents;

    objects.forEach((obj) => {
      const command = new GetObjectCommand({
        Bucket: listParams.Bucket,
        Key: obj.Key,
      });
      const s3Stream = s3.getObject(command).createReadStream();
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
