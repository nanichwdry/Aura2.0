import { GoogleGenAI, Modality, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const SYSTEM_INSTRUCTION = `You are Aura, a highly advanced AI assistant. 
You have access to real-time information via Google Search and Google Maps.
When users ask about places, routes, or directions, use the googleMaps tool.
You are specifically capable of route planning, including calculating tolls and finding the most efficient paths.
When users ask for directions, try to provide information about potential tolls if relevant.
When users ask about recent events or general knowledge, use the googleSearch tool.
You should be helpful, concise, and friendly.
If you use Google Maps, always provide the URLs for the places or routes you find from the grounding chunks.
Your voice should be warm and professional.`;

export async function chatWithAura(message: string, history: any[] = []) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [
        { googleSearch: {} },
        { googleMaps: {} }
      ],
    },
  });

  return response;
}

export async function generateSpeech(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
}
