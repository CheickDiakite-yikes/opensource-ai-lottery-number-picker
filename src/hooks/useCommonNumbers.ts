
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface CommonNumber {
  number: number;
  frequency: number;
}

export const useCommonNumbers = (gameType: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["common-numbers", gameType],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("most_common_numbers", {
        game_type_param: gameType,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load common numbers",
        });
        throw error;
      }

      return data as CommonNumber[];
    },
  });
};
