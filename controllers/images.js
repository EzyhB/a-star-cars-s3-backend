import { uploadImage } from "../s3.js";
import fs from "fs";
import util from "util";

const unlinkFile = util.promisify(fs.unlink);

//controller
const getImageByID = async (req, res) => {
  const ID = req.params.id.toString();

  const listParams = {
    Bucket: bucketName,
    Prefix: folderKey,
  };

  try {
    const data = await s3.listObjectsV2(listParams).promise();

    const objects = data.Contents;

    objects.forEach((obj) => {
      res.setHeader("Content-Type", obj.ContentType);
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

const postImageToS3 = async (req, res) => {
  try {
    // Get the images from the request
    const ID = req.params.id;
    const images = req.files;

    // Do something with the images (e.g. save to S3)

    if (!req.headers["content-type"].includes("multipart/form-data")) {
      console.log("Invalid request format, expected multipart/form-data.");

      return res.status(400).send({
        message: "Invalid request format, expected multipart/form-data.",
      });
    }

    console.log("Received images:", images);
    console.log("Heres the ID:", ID);

    const results = await uploadImage(images, ID);

    images.forEach(async (el) => {
      await unlinkFile(el.path);
    });

    res.status(200).json({
      message: "Uploaded files:",
      payload: results,
    });
  } catch (error) {
    console.error("error here", error);
    res
      .status(500)
      .send({ message: "An error occurred while processing the request." });
  }
};

export { getImageByID, postImageToS3 };
