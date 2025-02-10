
import { supabase } from "@/integrations/supabase/client";
import { getFingerprint } from "./fingerprintService";

const systemPrompt = `// ... keep existing code`;

const incrementAnonymousGenerations = async (fingerprint: string, gameType: string) => {
  try {
    // First select the current record to get the current monthly_generations value
    const { data: currentRecord } = await supabase
      .from('anonymous_generations')
      .select('monthly_generations')
      .eq('fingerprint', fingerprint)
      .eq('game_type', gameType)
      .single();

    const newMonthlyGenerations = (currentRecord?.monthly_generations || 0) + 1;

    // Then perform the upsert
    const { data, error } = await supabase
      .from('anonymous_generations')
      .upsert({
        fingerprint,
        game_type: gameType,
        monthly_generations: newMonthlyGenerations,
      }, {
        onConflict: 'fingerprint,game_type'
      });

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
        .rpc('can_generate_anonymous', { 
          fingerprint_param: fingerprint,
          game_type_param: type
        });

      if (checkError) {
        console.error("Error checking generation limit:", checkError);
        throw new Error("Failed to check generation limit. Please try again.");
      }

      if (!canGenerate) {
        throw new Error(`You've reached your limit of 5 free ${type} generations. Sign up for more!`);
      }

      await incrementAnonymousGenerations(fingerprint, type);
    } else {
      // For authenticated users
      const { data: canGenerate, error: checkError } = await supabase
        .rpc('can_generate_numbers', { user_id: user.id });

      if (checkError) {
        console.error("Error checking user generation limit:", checkError);
        throw new Error("Failed to check generation limit. Please try again.");
      }

      if (!canGenerate) {
        throw new Error("You've reached your monthly limit. Try again next month!");
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
