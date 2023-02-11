"use strict";
exports.__esModule = true;
var express_1 = require("express");
var images_1 = require("../controllers/images");
var imagesRouter = express_1["default"].Router();
imagesRouter.route("/images/:id").get(images_1.getImageByID).post(images_1.postImageToS3);
// router.route("/api/images/:id");
exports["default"] = imagesRouter;
