import express from "express";
import upload from "../middlewares/upload.js";
import { uploadPDF, askQuestion } from "../controllers/ragController.js";

const ragRouter = express.Router();

ragRouter.post("/upload", upload.single("pdf"), uploadPDF);

ragRouter.post("/ask", askQuestion);

export default ragRouter;