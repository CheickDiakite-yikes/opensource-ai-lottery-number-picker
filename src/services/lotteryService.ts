
import { supabase } from "@/integrations/supabase/client";
import { getFingerprint } from "./fingerprintService";

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

const incrementAnonymousGenerations = async (fingerprint: string) => {
  // First get current value
  const { data: current } = await supabase
    .from('anonymous_generations')
    .select('monthly_generations')
    .eq('fingerprint', fingerprint)
    .single();

  // Then update with incremented value
  const { error } = await supabase
    .from('anonymous_generations')
    .update({ monthly_generations: (current?.monthly_generations || 0) + 1 })
    .eq('fingerprint', fingerprint);

  if (error) throw error;
};

export const generateLotteryNumbers = async (
  type: "powerball" | "megamillions"
): Promise<number[]> => {
  const fingerprint = await getFingerprint();
  
  // Check if anonymous user can generate
  const { data: canGenerate, error: checkError } = await supabase
    .rpc('can_generate_anonymous', { fingerprint_param: fingerprint });

  if (checkError) throw checkError;

  if (!canGenerate) {
    throw new Error("You've reached your monthly limit of 5 generations. Sign up for 20 generations per month!");
  }

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

    await incrementAnonymousGenerations(fingerprint);
    
    const numbers = JSON.parse(data.generatedText);
    return numbers;
  } catch (error) {
    console.error("Error generating lottery numbers:", error);
    throw error;
  }
};
