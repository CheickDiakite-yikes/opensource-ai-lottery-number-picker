
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface LotteryNumber {
  id: string;
  game_type: string;
  numbers: number[];
  special_number: number;
  created_at: string;
  is_used: boolean;
  is_winner: boolean;
  prize_amount: number | null;
  checked_at: string | null;
}

export const useLotteryHistory = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["lottery-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lottery_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load lottery history",
        });
        throw error;
      }

      return data as LotteryNumber[];
    },
  });
};
