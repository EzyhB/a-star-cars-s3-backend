import express from "express";
import { getImageByID, postImageToS3 } from "../controllers/images";

const router = express.Router();

router.route("/images/:id").get(getImageByID).post(postImageToS3);
// router.route("/api/images/:id");
