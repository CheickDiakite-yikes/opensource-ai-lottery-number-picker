
import { LotteryCard } from "@/components/LotteryCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { useQuery } from "@tanstack/react-query";
import { getFingerprint } from "@/services/fingerprintService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface LotterySectionProps {
  session: any;
  monthlyGenerations: {
    monthly_generations: number;
    referral_bonus_generations: number | null;
  } | null | undefined;
}

export const LotterySection = ({ session, monthlyGenerations }: LotterySectionProps) => {
  const { toast } = useToast();
  const [anonymousGenerations, setAnonymousGenerations] = useState<number>(0);

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

  // Fetch anonymous generations count
  useEffect(() => {
    const fetchAnonymousGenerations = async () => {
      if (session?.user) return; // Don't fetch for logged-in users
      
      try {
        const fingerprint = await getFingerprint();
        const { data, error } = await supabase
          .from('anonymous_generations')
          .select('monthly_generations')
          .eq('fingerprint', fingerprint)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error("Error fetching anonymous generations:", error);
          return;
        }

        setAnonymousGenerations(data?.monthly_generations || 0);
      } catch (error) {
        console.error("Error in fetchAnonymousGenerations:", error);
      }
    };

    fetchAnonymousGenerations();
  }, [session?.user]);

  const handleGenerate = async (type: "powerball" | "megamillions") => {
    try {
      if (!session?.user) {
        if (anonymousGenerations >= 5) {
          toast({
            title: "Free Generations Limit Reached",
            description: "Sign up to get 20 free generations per month!",
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
        setAnonymousGenerations(prev => prev + 1);
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
        toast({
          title: "Numbers Generated!",
          description: `${5 - anonymousGenerations - 1} free generations remaining.`,
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
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Get <Badge variant="outline" className="ml-1">5 free generations</Badge> per game. 
              Sign up for <Badge variant="outline" className="ml-1">20 monthly generations</Badge>!
            </span>
            <Badge variant="secondary" className="ml-2">
              {5 - anonymousGenerations} remaining
            </Badge>
          </AlertDescription>
        </Alert>
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
