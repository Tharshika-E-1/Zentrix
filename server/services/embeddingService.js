import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const createEmbedding = async (text) => {
    const response = await ai.models.embedContent({
        model: "gemini-2.0-flash-001",
        contents: text,
    });

    return response.embeddings[0].values;
};