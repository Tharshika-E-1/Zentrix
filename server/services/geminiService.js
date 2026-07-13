import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log("API Key:", process.env.GEMINI_API_KEY.substring(0, 15));

export const askGemini = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  return response.text;
};

export const askGeminiVision = async (imageBuffer, prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBuffer.toString("base64"),
        },
      },
      {
        text: prompt,
      },
    ],
  });

  return response.text;
};