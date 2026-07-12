import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { askGeminiVision } from "../services/geminiService.js";
import imagekit from "../configs/imageKit.js";

export const visionController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const { chatId, prompt } = req.body;
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

const uploadResponse = await imagekit.upload({
  file: base64Image,
  fileName: `${Date.now()}-${req.file.originalname}`,
  folder: "vision",
});

    const chat = await Chat.findOne({
      userId,
      _id: chatId,
    });

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      isVision: true,

      // we'll improve this later
      image: uploadResponse.url,
    });

    // Update chat title
    if (chat.name === "New Chat") {
      chat.name =
        prompt.length > 40
          ? prompt.substring(0, 40) + "..."
          : prompt;
    }

    const replyText = await askGeminiVision(
      req.file.buffer,
      prompt
    );

    const reply = {
      role: "assistant",
      content: replyText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();
    console.log("Before save:");
console.log(chat.messages);
await chat.save();

console.log("After save:");
console.log(chat.messages.length);

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
  success: true,
  userMessage: chat.messages[chat.messages.length - 2],
  assistantMessage: chat.messages[chat.messages.length - 1],
});

  } catch (error) {
    console.log(error);

    const msg =
  error?.message?.includes("RESOURCE_EXHAUSTED")
    ? "Daily Gemini API quota exceeded. Please try again later."
    : error.message;

return res.json({
  success: false,
  message: msg,
});
  }
};