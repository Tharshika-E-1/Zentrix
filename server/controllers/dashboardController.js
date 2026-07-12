import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

export const getDashboard = async (req, res) => {
  try {
    console.log("UserId:", req.userId);

    const totalChats = await Chat.countDocuments({
      userId: req.userId,
    });
    const community = await Community.find()
.populate("user","name")
.sort({createdAt:-1})
.limit(4);

    const pinned = await Chat.find({
  userId: req.userId,
  isPinned: true,
})
const chats = await Chat.find({
  userId: req.userId,
}).select("createdAt");
const activeDays = new Set();

chats.forEach(chat => {
  const date = new Date(chat.createdAt)
    .toISOString()
    .split("T")[0];

  activeDays.add(date);
});

let streak = 0;

let today = new Date();

while (true) {
  const key = today.toISOString().split("T")[0];

  if (activeDays.has(key)) {
    streak++;
    today.setDate(today.getDate() - 1);
  } else {
    break;
  }
}

const recentActivity = await Chat.find({
  userId: req.userId,
})
.select("name updatedAt isPinned")
.sort({ updatedAt: -1 })
.limit(5);
// Last 7 days activity
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

const weeklyChats = await Chat.find({
  userId: req.userId,
  createdAt: { $gte: sevenDaysAgo },
}).select("createdAt");

const progress = [];

for (let i = 6; i >= 0; i--) {
  const day = new Date();
  day.setDate(day.getDate() - i);

  const start = new Date(day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(day);
  end.setHours(23, 59, 59, 999);

  const count = weeklyChats.filter(
    chat =>
      chat.createdAt >= start &&
      chat.createdAt <= end
  ).length;

  progress.push({
    day: start.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    chats: count,
  });
}

const uploadedPDFs = new Set();

const allChats = await Chat.find({
  userId: req.userId,
}).select("messages");

allChats.forEach(chat => {
  chat.messages.forEach(message => {
    if (message.pdfName) {
      uploadedPDFs.add(message.pdfName);
    }
  });
});

const totalPDFs = uploadedPDFs.size;

const pinnedChats = pinned.length;
const chatsWithMessages = await Chat.find({
  userId: req.userId,
}).select("messages");

let pdfCount = 0;

chatsWithMessages.forEach(chat => {
  chat.messages.forEach(message => {
    if (message.pdfName) {
      pdfCount++;
    }
  });
});

    const user = await User.findById(req.userId);
    if (streak > user.bestStreak) {
    user.bestStreak = streak;
    await user.save();
}
const badgeLevels = [7, 10, 15, 30, 50, 100];

const nextBadge =
    badgeLevels.find(level => level > streak) || "Max";

    console.log("User:", user);

    res.json({
    success: true,

    totalChats,
    pinnedChats,
    credits: user.credits,
    pdfs: pdfCount,

    streak,
    bestStreak: user.bestStreak,
    nextBadge,

    pinned,
    recentActivity,
    progress,
    community,
});

  } catch (err) {
    console.log(err); // <-- IMPORTANT
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ userId });

    // Last 28 days
const activity = Array.from({ length: 4 }, () => Array(7).fill(0));

const today = new Date();
today.setHours(0, 0, 0, 0);

chats.forEach(chat => {
  chat.messages.forEach(message => {

    if (message.role !== "user") return;

    const messageDate = new Date(message.timestamp);
    messageDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today - messageDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 0 && diffDays < 28) {

      const week = 3 - Math.floor(diffDays / 7);
      const day = messageDate.getDay();

      activity[week][day]++;

    }

  });
});
    res.json({
      success: true,
      activity,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};