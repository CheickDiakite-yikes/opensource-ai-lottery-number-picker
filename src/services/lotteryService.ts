
import { supabase } from "@/integrations/supabase/client";

const systemPrompt = `You are an AI lottery number predictor. Generate numbers based on historical patterns and mathematical analysis. For Powerball, generate 5 numbers (1-69) and 1 Powerball number (1-26). For Mega Millions, generate 5 numbers (1-70) and 1 Mega Ball number (1-25). Return only the numbers in an array format.`;

export const generateLotteryNumbers = async (
  type: "powerball" | "megamillions"
): Promise<number[]> => {
  const prompt = `Generate ${
    type === "powerball" ? "Powerball" : "Mega Millions"
  } numbers. Format: [n1,n2,n3,n4,n5,special]`;

  try {
    const { data, error } = await supabase.functions.invoke('generate', {
      body: {
        prompt: `${systemPrompt}\n${prompt}`,
      },
    });

    if (error) {
      throw error;
    }

    const numbers = JSON.parse(data.generatedText);
    return numbers;
  } catch (error) {
    console.error("Error generating lottery numbers:", error);
    throw error;
  }
}
