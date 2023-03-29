import express from "express";
import { postImageToS3 } from "../controllers/images.js";
import multer from "multer";

const upload = multer({
  dest: "/uploads",
  limits: {
    fileSize: 10485760, // 10MB in bytes
  },
});
const ImageRouter = express.Router();

ImageRouter.post("/images/:id", upload.single("filezzz"), (req, res) => {
  postImageToS3(req, res);
});

export default ImageRouter;
