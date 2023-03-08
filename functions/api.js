import express from "express";
import imagesRouter from "../routes/images.js";
import cors from "cors";
import serverless from "serverless-http";

const app = express();

app.use(cors());

app.use("/.netlify/functions/api", imagesRouter);
// app.use("/.netlify/functions", imagesRouter);

module.exports.handler = serverless(app);
