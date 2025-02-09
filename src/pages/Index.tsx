
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { RecentWinningNumbers } from "@/components/home/RecentWinningNumbers";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { LotterySection } from "@/components/home/LotterySection";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const { session } = useAuth();

  const { data: monthlyGenerations } = useQuery({
    queryKey: ["monthly-generations"],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_generations, streak_count, level, luck_meter")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const { data: recentWinningNumbers } = useQuery({
    queryKey: ["recent-winning-numbers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("winning_numbers")
        .select("*")
        .order("draw_date", { ascending: false })
        .limit(2);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <WelcomeHeader 
            session={session} 
            monthlyGenerations={monthlyGenerations} 
          />

          <AnimatePresence>
            <RecentWinningNumbers recentWinningNumbers={recentWinningNumbers} />
          </AnimatePresence>

          <LotterySection 
            session={session} 
            monthlyGenerations={monthlyGenerations} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
