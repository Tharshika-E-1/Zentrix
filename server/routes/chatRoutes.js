import express from "express";
import {createChat, deleteChat, getChats, renameChat, clearChat, pinChat,} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";


const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.get("/get", protect, getChats);
chatRouter.post("/delete", protect, deleteChat);
chatRouter.put("/rename", protect, renameChat);
chatRouter.post("/clear", protect, clearChat);
chatRouter.post("/pin", protect, pinChat);

export default chatRouter;