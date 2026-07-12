import ShareChat from "../models/ShareChat.js";
import { v4 as uuidv4 } from "uuid";

// Create Share Link
export const createShareLink = async (req, res) => {
  try {
    const { chatId, messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.json({
        success: false,
        message: "No messages found",
      });
    }

    const shareId = uuidv4();

    const sharedChat = await ShareChat.create({
      chatId,
      messages,
      shareId,
    });

    return res.json({
      success: true,
      shareUrl: `http://localhost:5173/share/${sharedChat.shareId}`,
    });

  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Shared Chat
export const getSharedChat = async (req, res) => {
  try {

    const { id } = req.params;

    const chat = await ShareChat.findOne({
      shareId: id,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Shared chat not found",
      });
    }

    return res.json({
      success: true,
      messages: chat.messages,
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};