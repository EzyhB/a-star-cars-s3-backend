import query from "../db";

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
  // Get the images from the request
  const images = req.files;

  // Do something with the images (e.g. save to S3)
  console.log("Received images:", images);

  res.json({ success: true, message: "FormData received" });
};

export { getImageByID, postImageToS3 };
