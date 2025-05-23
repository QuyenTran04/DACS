import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;


export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};
export const generateTripPlan = async (prompt: string) => {
  
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    console.log("Kế hoạch chuyến đi:\n", JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (error) {
    console.error(" Lỗi parse JSON từ Gemini:", error);
    throw new Error("Phản hồi không phải JSON hợp lệ");
  }
};
