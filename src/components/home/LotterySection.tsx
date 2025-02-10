
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFingerprint } from "@/services/fingerprintService";
import { useEffect, useState } from "react";
import { AnonymousUserAlert } from "./AnonymousUserAlert";
import { GameCard } from "@/components/lottery/GameCard";
import { useLotteryGeneration } from "@/hooks/useLotteryGeneration";

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
      if (session?.user) return;
      
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

  const { handleGenerate } = useLotteryGeneration({
    session,
    monthlyGenerations,
    isAdmin: !!isAdmin,
    anonymousGenerations,
    setAnonymousGenerations,
  });

  return (
    <div className="space-y-6">
      {!session?.user && (
        <AnonymousUserAlert anonymousGenerations={anonymousGenerations} />
      )}
      
      <div className="grid gap-8 md:grid-cols-2">
        <GameCard type="powerball" onGenerate={handleGenerate} />
        <GameCard type="megamillions" onGenerate={handleGenerate} />
      </div>
    </div>
  );
};
