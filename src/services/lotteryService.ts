
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
  try {
    const { data, error } = await supabase
      .from('anonymous_generations')
      .upsert(
        { 
          fingerprint, 
          monthly_generations: 1 
        },
        { 
          onConflict: 'fingerprint',
          update: {
            monthly_generations: supabase.raw('monthly_generations + 1')
          }
        }
      );

    if (error) {
      console.error("Error incrementing anonymous generations:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in incrementAnonymousGenerations:", error);
    throw error;
  }
};

export const generateLotteryNumbers = async (
  type: "powerball" | "megamillions"
): Promise<number[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting user:", userError);
    }
    
    // For anonymous users
    if (!user) {
      const fingerprint = await getFingerprint();
      console.log("Anonymous user with fingerprint:", fingerprint);
      
      const { data: canGenerate, error: checkError } = await supabase
        .rpc('can_generate_anonymous', { fingerprint_param: fingerprint });

      if (checkError) {
        console.error("Error checking generation limit:", checkError);
        throw new Error("Failed to check generation limit. Please try again.");
      }

      if (!canGenerate) {
        throw new Error("You've reached your monthly limit of 5 generations. Sign up for 20 generations per month!");
      }

      await incrementAnonymousGenerations(fingerprint);
    } else {
      // For authenticated users
      const { data: canGenerate, error: checkError } = await supabase
        .rpc('can_generate_numbers', { user_id: user.id });

      if (checkError) {
        console.error("Error checking user generation limit:", checkError);
        throw new Error("Failed to check generation limit. Please try again.");
      }

      if (!canGenerate) {
        throw new Error("You've reached your monthly limit of 20 generations. Try again next month!");
      }
    }

    const prompt = `Generate ${
      type === "powerball" ? "Powerball" : "Mega Millions"
    } numbers. Format: [n1,n2,n3,n4,n5,special]`;

    const { data, error } = await supabase.functions.invoke('generate', {
      body: {
        prompt: `${systemPrompt}\n${prompt}`,
      },
    });

    if (error) {
      console.error("Error invoking generate function:", error);
      throw new Error("Failed to generate numbers. Please try again.");
    }

    if (!data || !data.generatedText) {
      throw new Error("Failed to generate numbers. Please try again.");
    }
    
    let numbers;
    try {
      numbers = JSON.parse(data.generatedText);
      if (!Array.isArray(numbers) || numbers.length !== 6) {
        throw new Error("Invalid number format received");
      }
    } catch (parseError) {
      console.error("Error parsing generated numbers:", parseError);
      throw new Error("Failed to process generated numbers. Please try again.");
    }
    
    return numbers;
  } catch (error) {
    console.error("Error in generateLotteryNumbers:", error);
    throw error;
  }
};
