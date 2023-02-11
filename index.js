"use strict";
exports.__esModule = true;
var express_1 = require("express");
var images_1 = require("./routes/images");
var cors_1 = require("cors");
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])());
app.use("api/v1", images_1["default"]);
app.listen(3000, function () {
    console.log("Express server listening...");
});
