import express from "express";

import { getImagesFromS3, uploadMulter } from "../s3.js";

const ImageRouter = express.Router();

ImageRouter.route("/images/:id")
  .get(getImagesFromS3)
  .post(uploadMulter.array("images[]"), (req, res) => {
    res.json({
      response: 200,
      message: "you did it dumbass",
    });
  });

export default ImageRouter;
