import query from "../db/index.js";
import { uploadImage } from "../s3.js";

//controller
const getImageByID = async (req, res) => {
  const ID = req.params.toString();

  const data = await query("SELECT * FROM car_images WHERE Id = $1;", [ID]);

  return res.status(200).json({
    message: "Get all car images by ID operation successful",
    result: data.rows,
  });
};

const postImageToS3 = async (req, res) => {
  try {
    // Get the images from the request
    const ID = req.params;
    const images = req.files;

    // Do something with the images (e.g. save to S3)

    if (!req.headers["content-type"].includes("multipart/form-data")) {
      console.log("Invalid request format, expected multipart/form-data.");

      return res.status(400).send({
        message: "Invalid request format, expected multipart/form-data.",
      });
    }

    console.log("Received images:", images);

    const results = await uploadImage(images, ID);

    results.json({
      status: 200,
      message: "Uploaded files:",
      payload: results,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while processing the request." });
  }
};

export { getImageByID, postImageToS3 };
