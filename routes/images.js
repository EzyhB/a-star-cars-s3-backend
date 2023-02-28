import express from "express";
import { getImageByID, postImageToS3 } from "../controllers/images.js";
import multer from "multer";
import { getImagesFromS3 } from "../s3.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 },
});

const ImageRouter = express.Router();

ImageRouter.route("/images/:id")
  .get(getImagesFromS3)
  .post(upload.array("images[]"), postImageToS3);

export default ImageRouter;
