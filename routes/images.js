import express from "express";
// import { postImageToS3 } from "../controllers/images.js";
// import multer from "multer";
import { getImagesFromS3, postImageToS3Multer, uploadMulter } from "../s3.js";

// const upload = multer({
//   dest: "uploads/",
//   limits: { fileSize: 50 * 1024 * 1024 },
// });

const ImageRouter = express.Router();

ImageRouter.route("/images/:id")
  .get(getImagesFromS3)
  .post(uploadMulter.array("images[]"), postImageToS3Multer);

export default ImageRouter;

/*
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowUserToPutObjects",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:user/your-iam-user-name"
            },
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::astarcarsales-bucket/*"
        }
    ]
}
*/
