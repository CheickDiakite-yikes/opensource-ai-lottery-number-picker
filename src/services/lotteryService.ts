
import { supabase } from "@/integrations/supabase/client";

const systemPrompt = `You are an advanced AI lottery number predictor specializing in strategic number generation. Analyze the following factors:

1. Statistical Distribution: Ensure numbers are well-distributed across the possible range
2. Pattern Analysis: Avoid obvious patterns like all consecutive numbers
3. Hot/Cold Analysis: Consider both frequently drawn numbers and overdue numbers
4. Number Grouping: Balance between low and high numbers
5. Sum Analysis: Keep the total sum within historically successful ranges

For Powerball:
- Generate 5 main numbers (1-69)
- 1 Powerball number (1-26)
- Consider statistical weight of even/odd ratios

For Mega Millions:
- Generate 5 main numbers (1-70)
- 1 Mega Ball number (1-25)
- Maintain historical distribution patterns

Return ONLY the numbers in an array format [n1,n2,n3,n4,n5,special].`;

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
      throw new Error(error.message);
    }

    if (!data || !data.generatedText) {
      throw new Error("Failed to generate numbers");
    }

    const numbers = JSON.parse(data.generatedText);
    return numbers;
  } catch (error) {
    console.error("Error generating lottery numbers:", error);
    throw error;
  }
};
