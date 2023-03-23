import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageRouter from "../routes/images.js";

const app = express();

app.use(cors());

app.use("/.netlify/functions/api", ImageRouter);

export const handler = serverless(app);
