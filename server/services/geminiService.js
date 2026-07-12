import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askGemini = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return response.text;
};

export const askGeminiVision = async (imageBuffer, prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
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