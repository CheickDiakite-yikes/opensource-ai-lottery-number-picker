
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

export interface WinRate {
  total_plays: number;
  total_wins: number;
  win_rate: number;
  total_earnings: number;
}

export const useWinRate = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["win-rate"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_win_rate", {
        user_id_param: session?.user.id,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load win rate statistics",
        });
        throw error;
      }

      return (data as WinRate[])[0];
    },
  });
};
