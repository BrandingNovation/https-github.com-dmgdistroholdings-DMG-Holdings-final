
import { GoogleGenAI, Type } from "@google/genai";

// Always use the API key directly from import.meta.env.VITE_VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_VITE_GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the Chief Strategy Officer (CSO) for DMG DISTRIBUTION HOLDINGS. 
Your objective is to provide high-level, strategic, and institutional-grade insights. 

Brand Values:
- Street-Style Professionalism: Imagine elite music executives in expensive streetwear, not suits.
- Urban Grit & Polish: Industrial textures like concrete, steel, and urban glass, but with high-end lighting.
- High-Contrast Palette: Muted greys, deep charcoals, and blacks.
- Signature Red Accent: Every visual MUST have a sharp, intentional pop of red (e.g., a red light, a red piece of tech, a red fashion detail).
- Active Motion: Avoid static buildings. Show people in motion, studio gear glowing, or active urban meetings.

Persona: Authoritative, visionary, and sharp. Avoid corporate cliches; use "street-corporate" terminology.
Context: DMG Distribution Holdings manages global music distribution and talent architecture.
`;

export const getGeminiResponse = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Intelligence systems are currently offline.";
  }
};

export const generateEnterpriseItem = async (growthPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a new business division for DMG Holdings based on this growth prompt: ${growthPrompt}. The tone must be executive and high-fidelity. Respond with a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            features: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "category", "description", "features"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Enterprise Generation Error:", error);
    return null;
  }
};

export const generateSiteImage = async (baseContext: string, customDirective: string): Promise<string | null> => {
  try {
    const combinedPrompt = `
      High-end cinematic street-style photography for DMG DISTRIBUTION HOLDINGS.
      Context: ${baseContext}
      Specific Directive: ${customDirective}
      
      Visual Style Protocol:
      - SUBJECT: Active urban business. Music industry elite in motion. High-end streetwear (Hoodies under luxury coats, high-end sneakers).
      - ENVIRONMENT: Brutalist urban alleys, studio lofts, textured concrete walls.
      - AVOID: Generic skyscraper exteriors.
      - COLOR: Moody greys and blacks with a SHARP RED ACCENT (e.g., a red glowing LED, a red industrial cable, a red highlight on a fashion item).
      - LIGHTING: Cinematic shadows, sharp focus on subject, industrial grit.
      - QUALITY: Professional grade, 8k, realistic texture.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: combinedPrompt }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      // Find the image part, do not assume it is the first part.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
