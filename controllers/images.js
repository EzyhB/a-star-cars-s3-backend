import { uploadFileToS3 } from "../s3.js";
// import fs from "fs";
// import util from "util";

// const unlinkFile = util.promisify(fs.unlink);

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
    const imageFile = req.file;
    const ID = req.params.id;

    // Check if a file was uploaded
    if (!imageFile) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Upload the file to S3
    const result = await uploadFileToS3(imageFile, ID);

    // Return the uploaded image URL
    res.status(200).json({
      message: "Image uploaded successfully",
      data: { imageUrl: result.Location },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error uploading image" });
  }
};

export { getImageByID, postImageToS3 };
