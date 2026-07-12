import Chat from "../models/Chat.js";

// API Controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };
    const chat = await Chat.create(chatData);

res.json({
  success: true,
  chat,
});
  } catch (error) {
    res.json({success: false, message: error.message,});
  }
};

//API Controller for getting all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({
  isPinned: -1,
  updatedAt: -1,
});

    
    res.json({success: true, chats});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
};

//API Controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const {chatId} = req.body

    await Chat.deleteOne({_id: chatId, userId})
    
    res.json({success: true, message: "Chat Deleted"});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
};

export const renameChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, name } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { name },
      { new: true }
    );

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      chat,
      message: "Chat renamed ",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const clearChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages = [];

    await chat.save();

    res.json({
      success: true,
      message: "Chat cleared ",
      chat,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const pinChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.isPinned = !chat.isPinned;

    await chat.save();

    res.json({
      success: true,
      message: chat.isPinned
        ? "Chat pinned "
        : "Chat unpinned ",
      chat,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};