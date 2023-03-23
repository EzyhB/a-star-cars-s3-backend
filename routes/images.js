import express from "express";
import { postImageToS3 } from "../controllers/images.js";

const ImageRouter = express.Router();

ImageRouter.route("/images/:id").post(postImageToS3);

export default ImageRouter;
