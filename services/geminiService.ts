import { GoogleGenAI, Type } from "@google/genai";
import { Gender, AIHealthAdvice } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiHealthAdvice = async (
  bmi: number,
  age: number,
  gender: Gender,
  category: string,
  bmr: number
): Promise<AIHealthAdvice> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Act as a professional nutritionist and fitness expert.
      User Profile:
      - Age: ${age}
      - Gender: ${gender}
      - BMI: ${bmi.toFixed(1)} (${category})
      - BMR (Basal Metabolic Rate): ~${Math.round(bmr)} kcal/day
      
      Provide a structured JSON response with:
      1. A professional, empathetic analysis of their current status (max 2 sentences).
      2. 3 specific, actionable dietary tips. Mention calorie management based on their BMR if relevant.
      3. 3 specific, actionable exercise tips suitable for their fitness level.
      4. A short, uplifting motivational quote.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            dietaryTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            exerciseTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            motivationalQuote: { type: Type.STRING }
          },
          required: ["analysis", "dietaryTips", "exerciseTips", "motivationalQuote"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as AIHealthAdvice;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error (e.g., API key missing)
    return {
      analysis: "We are unable to generate personalized AI insights at the moment. Please consult a healthcare provider.",
      dietaryTips: ["Eat a balanced diet rich in vegetables.", "Stay hydrated.", "Limit processed sugars."],
      exerciseTips: ["Aim for 30 minutes of walking daily.", "Incorporate strength training.", "Stretch regularly."],
      motivationalQuote: "Health is a journey, not a destination."
    };
  }
};