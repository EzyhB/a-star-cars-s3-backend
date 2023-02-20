import query from "../db/index.js";
import { getImagesFromS3, uploadImage } from "../s3.js";

//controller
const getImageByID = async (req, res) => {
  try {
    const ID = req.params.id.toString();

    const data = await getImagesFromS3(ID);

    return res.status(200).json({
      message: "Get all car images by ID operation successful",
      result: data,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while processing the request." });
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

    console.log("got to this part");

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
