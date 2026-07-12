import express from "express";
import {
  createShareLink,
  getSharedChat,
} from "../controllers/shareController.js";

const shareRouter = express.Router();

// Create Share Link
shareRouter.post("/", createShareLink);

// Get Shared Chat
shareRouter.get("/:id", getSharedChat);

export default shareRouter;