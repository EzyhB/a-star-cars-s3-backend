import express from "express";
import { getImageByID, postImageToS3 } from "../controllers/images";

const imagesRouter = express.Router();

imagesRouter.route("/images/:id").get(getImageByID).post(postImageToS3);
// router.route("/api/images/:id");

export default imagesRouter;
