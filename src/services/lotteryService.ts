
import { Configuration, OpenAIApi } from "openai";

const systemPrompt = `You are an AI lottery number predictor. Generate numbers based on historical patterns and mathematical analysis. For Powerball, generate 5 numbers (1-69) and 1 Powerball number (1-26). For Mega Millions, generate 5 numbers (1-70) and 1 Mega Ball number (1-25). Return only the numbers in an array format.`;

export const generateLotteryNumbers = async (
  type: "powerball" | "megamillions"
): Promise<number[]> => {
  const prompt = `Generate ${
    type === "powerball" ? "Powerball" : "Mega Millions"
  } numbers. Format: [n1,n2,n3,n4,n5,special]`;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${systemPrompt}\n${prompt}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate numbers");
    }

    const data = await response.json();
    const numbers = JSON.parse(data.generatedText);
    return numbers;
  } catch (error) {
    console.error("Error generating lottery numbers:", error);
    throw error;
  }
};
