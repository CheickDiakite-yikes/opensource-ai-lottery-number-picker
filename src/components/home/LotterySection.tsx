import { LotteryCard } from "@/components/LotteryCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { useQuery } from "@tanstack/react-query";
import { getFingerprint } from "@/services/fingerprintService";
import { useEffect, useState } from "react";
import { AnonymousUserAlert } from "./AnonymousUserAlert";

interface GameGenerations {
  powerball: number;
  megamillions: number;
}

interface LotterySectionProps {
  session: any;
  monthlyGenerations: {
    monthly_generations: number;
    referral_bonus_generations: number | null;
  } | null | undefined;
}

export const LotterySection = ({ session, monthlyGenerations }: LotterySectionProps) => {
  const { toast } = useToast();
  const [anonymousGenerations, setAnonymousGenerations] = useState<GameGenerations>({
    powerball: 0,
    megamillions: 0
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    const fetchAnonymousGenerations = async () => {
      if (session?.user) return; // Don't fetch for logged-in users
      
      try {
        const fingerprint = await getFingerprint();
        const { data, error } = await supabase
          .from('anonymous_generations')
          .select('monthly_generations, game_type')
          .eq('fingerprint', fingerprint);

        if (error) {
          console.error("Error fetching anonymous generations:", error);
          return;
        }

        const generations: GameGenerations = {
          powerball: 0,
          megamillions: 0
        };

        data?.forEach(record => {
          if (record.game_type === 'powerball') {
            generations.powerball = record.monthly_generations || 0;
          } else if (record.game_type === 'megamillions') {
            generations.megamillions = record.monthly_generations || 0;
          }
        });

        setAnonymousGenerations(generations);
      } catch (error) {
        console.error("Error in fetchAnonymousGenerations:", error);
      }
    };

    fetchAnonymousGenerations();
  }, [session?.user]);

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

  return (
    <div className="space-y-6">
      {!session?.user && (
        <AnonymousUserAlert anonymousGenerations={anonymousGenerations} />
      )}
      
      <div className="grid gap-8 md:grid-cols-2">
        <LotteryCard
          title="Powerball"
          description="Generate 5 numbers (1-69) + 1 Powerball number (1-26)"
          isPowerball
          onGenerate={() => handleGenerate("powerball")}
        />
        <LotteryCard
          title="Mega Millions"
          description="Generate 5 numbers (1-70) + 1 Mega Ball number (1-25)"
          onGenerate={() => handleGenerate("megamillions")}
        />
      </div>
    </div>
  );
};
