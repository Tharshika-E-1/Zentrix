import express from "express";
import uploadImage from "../middlewares/uploadImage.js";
import { visionController } from "../controllers/visionController.js";
import { protect } from "../middlewares/auth.js";

const visionRouter = express.Router();

visionRouter.post(
  "/chat",
  protect,
  uploadImage.single("image"),
  visionController
);

export default visionRouter;