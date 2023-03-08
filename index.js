import express from "express";
import imagesRouter from "./routes/images.js";
import cors from "cors";
import serverless from "serverless-http";

const app = express();

app.use(cors());

app.use("/api/v1", imagesRouter);
// app.use("/.netlify/functions", imagesRouter);

app.listen(3001, () => {
  console.log("Express server listening...");
});

module.exports.handler = serverless(app);
