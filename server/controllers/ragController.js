import fs from "fs";
import { createRequire } from "module";
import { splitIntoChunks } from "../services/chunkService.js";
import { saveDocument, getDocument } from "../services/documentStore.js";
import { askGroq } from "../services/groqService.js";
import { createEmbedding } from "../services/embeddingService.js";
import { storeEmbedding, searchEmbedding  } from "../services/vectorService.js";
import Chat from "../models/Chat.js";

// Upload PDF
export const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded"
            });
        }
        const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

        const buffer = fs.readFileSync(req.file.path);

const pdfData = await pdf(buffer);

const text = pdfData.text;

        const chunks = splitIntoChunks(text);

// Store original text (optional)
saveDocument(text);

// Generate embeddings for every chunk
for (let i = 0; i < chunks.length; i++) {

    const embedding = await createEmbedding(chunks[i]);

    await storeEmbedding(
        `${req.file.originalname}-${i}`,
        chunks[i],
        embedding
    );
}

console.log("Embeddings Stored:", chunks.length);
        console.log("Stored PDF:");
console.log(getDocument());

      

        res.json({
            success: true,
            pages: pdfData.numpages,
            characters: text.length,
            totalChunks: chunks.length,
            firstChunk: chunks[0]
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// 👇 Add this below uploadPDF
export const askQuestion = async (req, res) => {
    try {

        const {
    question,
    chatId,
    pdfName,
    userId,
} = req.body;
console.log(req.body);
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
chat.messages.push({
    role: "user",
    content: question,
    timestamp: Date.now(),
    isImage: false,
    isPDF: true,
    pdfName,
});

        // Create embedding for user's question
        const questionEmbedding = await createEmbedding(question);

        // Find the most relevant chunks
        const relevantChunks = await searchEmbedding(questionEmbedding);
        console.log("========== Retrieved Chunks ==========");
console.log(relevantChunks);
console.log("======================================");

        const prompt = `
You are an AI assistant.

Answer ONLY using the context below.

Context:

${relevantChunks.join("\n\n")}

Question:
${question}
`;

        const answer = await askGroq(prompt);
        chat.messages.push({
    role: "assistant",
    content: answer,
    timestamp: Date.now(),
    isImage: false,
});

await chat.save();

        res.json({
            success: true,
            answer
        });

    } catch (err) {
        console.log(err);

        res.json({
            success: false,
            message: err.message
        });
    }
};