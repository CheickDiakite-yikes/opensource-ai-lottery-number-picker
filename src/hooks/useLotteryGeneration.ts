
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLotteryNumbers } from "@/services/lotteryService";

interface GameGenerations {
  powerball: number;
  megamillions: number;
}

interface UseLotteryGenerationProps {
  session: any;
  monthlyGenerations: {
    monthly_generations: number;
    referral_bonus_generations: number | null;
  } | null | undefined;
  isAdmin: boolean;
  anonymousGenerations: GameGenerations;
  setAnonymousGenerations: (generations: GameGenerations) => void;
}

export const useLotteryGeneration = ({
  session,
  monthlyGenerations,
  isAdmin,
  anonymousGenerations,
  setAnonymousGenerations,
}: UseLotteryGenerationProps) => {
  const { toast } = useToast();

  const handleGenerate = async (type: "powerball" | "megamillions") => {
    try {
      if (!session?.user) {
        const currentGenerations = type === 'powerball' 
          ? anonymousGenerations.powerball 
          : anonymousGenerations.megamillions;
          
        if (currentGenerations >= 5) {
          toast({
            title: "Free Generations Limit Reached",
            description: `You've used all 5 free ${type} generations. Sign up to get 20 monthly generations plus referral bonuses!`,
            variant: "destructive",
          });
          return [];
        }
      } else if (!isAdmin && monthlyGenerations) {
        const totalAllowedGenerations = 20 + (monthlyGenerations?.referral_bonus_generations || 0);
        if (monthlyGenerations?.monthly_generations >= totalAllowedGenerations) {
          toast({
            title: "Monthly Limit Reached",
            description: `You've reached your limit of ${totalAllowedGenerations} generations this month. Please try again next month.`,
            variant: "destructive",
          });
          return [];
        }
      }

      const numbers = await generateLotteryNumbers(type);
      
      // Update local state for anonymous users
      if (!session?.user) {
        setAnonymousGenerations(prev => ({
          ...prev,
          [type]: (prev[type] || 0) + 1
        }));
      }
      
      // Save to history if user is logged in
      if (session?.user) {
        try {
          const { error } = await supabase.from("lottery_history").insert({
            numbers: numbers.slice(0, -1),
            special_number: numbers[numbers.length - 1],
            game_type: type,
            user_id: session.user.id
          });

          if (error) {
            console.error("Error saving numbers:", error);
            throw error;
          }

          toast({
            title: "Numbers Generated!",
            description: "Your lucky numbers have been saved.",
          });
        } catch (error: any) {
          console.error("Error saving numbers:", error);
          toast({
            title: "Error",
            description: "Failed to save your numbers",
            variant: "destructive",
          });
        }
      } else {
        const remainingGenerations = 5 - (type === 'powerball' ? 
          anonymousGenerations.powerball + 1 : 
          anonymousGenerations.megamillions + 1);
          
        toast({
          title: "Numbers Generated!",
          description: `${remainingGenerations} free ${type} generations remaining.`,
        });
      }
      
      return numbers;
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return { handleGenerate };
};
