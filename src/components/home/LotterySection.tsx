
import { LotteryCard } from "@/components/LotteryCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { useQuery } from "@tanstack/react-query";

interface LotterySectionProps {
  session: any;
  monthlyGenerations: {
    monthly_generations: number;
    referral_bonus_generations: number | null;
  } | null | undefined;
}

export const LotterySection = ({ session, monthlyGenerations }: LotterySectionProps) => {
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return !!data;
    },
    enabled: !!session?.user,
  });

  const handleGenerate = async (type: "powerball" | "megamillions") => {
    try {
      // Skip limit check for admin users
      if (session?.user && !isAdmin && monthlyGenerations) {
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
      
      // For authenticated users, save to history
      if (session?.user) {
        try {
          const { error } = await supabase.from("lottery_history").insert({
            numbers: numbers.slice(0, -1),
            special_number: numbers[numbers.length - 1],
            game_type: type,
            user_id: session.user.id
          });

          if (error) throw error;

          toast({
            title: "Numbers Generated!",
            description: "Your lucky numbers have been saved.",
          });
        } catch (error) {
          console.error("Error saving numbers:", error);
          toast({
            title: "Error",
            description: "Failed to save your numbers",
            variant: "destructive",
          });
        }
      }
      
      return numbers;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return (
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
  );
};
