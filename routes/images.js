import express from "express";
import { getImageByID, postImageToS3 } from "../controllers/images.js";

const ImageRouter = express.Router();

ImageRouter.route("/images/:id").get(getImageByID).post(postImageToS3);
// router.route("/api/images/:id");

export default ImageRouter;
