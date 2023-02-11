import express from "express";
import imagesRouter from "./routes/images";
import cors from "cors";

const app = express();

app.use(cors());

app.use("api/v1", imagesRouter);

app.listen(3000, () => {
  console.log("Express server listening...");
});
