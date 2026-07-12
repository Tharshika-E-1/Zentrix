import fetchWebsiteContent from "../services/websiteService.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const websiteChatController = async (req, res) => {
  try {
    const { url, question } = req.body;
    let userId;

if (req.user) {
  userId = req.user._id;
} else {
  console.log("req.user is undefined");
}
const { chatId } = req.body;

    console.log("=================================");
    console.log("Website Chat Request");
    console.log("URL:", url);
    console.log("Question:", question);

    // Validate input
    if (!url || !question) {
      return res.json({
        success: false,
        message: "Website URL and question are required",
      });
    }
    
console.log("req.user =", req.user);
console.log("req.userId =", req.userId);
console.log("chatId:", chatId);
console.log("userId:", userId);
    console.log("Searching by chatId only...");

const chat = await Chat.findById(chatId);

console.log("Found by ID:", chat);

console.log("Searching by user...");

const userChats = await Chat.find({ userId });

console.log(
  userChats.map(c => ({
    id: c._id.toString(),
    name: c.name,
  }))
);

console.log("Found chat:", chat);


if (!chat) {
  return res.json({
    success: false,
    message: "Chat not found",
  });
}
const userMessage = {
  role: "user",
  content: question,
  website: url,
  timestamp: Date.now(),
  isImage: false,
  isPDF: false,
  pdfName: "",
};

chat.messages.push(userMessage);

if (chat.name === "New Chat") {
  chat.name =
    question.length > 40
      ? question.substring(0, 40) + "..."
      : question;
}

    // Fetch website content
    console.log("Fetching website content...");
    const websiteText = await fetchWebsiteContent(url);

    console.log("Website fetched successfully.");
    console.log("Website content length:", websiteText.length);

    // Limit prompt size
    const content = websiteText.substring(0,12000);
    // Send to Gemini
    console.log("Sending to Gemini...");

   const { choices } = await openai.chat.completions.create({
  model: "gemini-3.5-flash",
  messages: [
    {
      role: "system",
      content: `You answer ONLY using the website content provided.
If the answer is not available, reply:
"I couldn't find that information on this website."`
    },
    {
      role: "user",
      content: `
Website Content:

${content}

----------------------

Question:
${question}
`
    }
  ]
});

console.log(choices[0].message.content);
const assistantMessage = {
  role: "assistant",
  content: choices[0].message.content,
  timestamp: Date.now(),
  isImage: false,
  isPDF: false,
  pdfName: "",
};

chat.messages.push(assistantMessage);

await chat.save();

await User.updateOne(
  { _id: userId },
  { $inc: { credits: -1 } }
);

    console.log("Gemini Reply:");
console.log(assistantMessage.content);
console.log("=================================");

    return res.json({
  success: true,
  userMessage,
  assistantMessage,
});

  } catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
  console.error("MESSAGE:", error.message);

  if (error.response) {
    console.error("STATUS:", error.response.status);
    console.error("DATA:", error.response.data);
  }

  return res.json({
    success: false,
    message: error.message,
  });
  }
};