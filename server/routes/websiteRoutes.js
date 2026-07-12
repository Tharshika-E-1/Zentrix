import express from "express";
import { websiteChatController } from "../controllers/websiteController.js";
import { protect } from "../middlewares/auth.js";

const websiteRouter = express.Router();

websiteRouter.post("/chat", protect, websiteChatController);

export default websiteRouter;