import mongoose from "mongoose";

const shareChatSchema = new mongoose.Schema(
{
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },

    messages: [
        {
            role: String,
            content: String,
            website: String,
            isImage: Boolean,
            timestamp: Number,
        },
    ],

    shareId: {
        type: String,
        unique: true,
    },
},
{
    timestamps: true,
}
);

export default mongoose.model("ShareChat", shareChatSchema);