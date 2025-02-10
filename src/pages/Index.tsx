
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { RecentWinningNumbers } from "@/components/home/RecentWinningNumbers";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { LotterySection } from "@/components/home/LotterySection";
import { ReferralSection } from "@/components/home/ReferralSection";
import { AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

const Index = () => {
  const { session } = useAuth();

  const { data: monthlyGenerations } = useQuery({
    queryKey: ["monthly-generations"],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_generations, streak_count, level, luck_meter, referral_bonus_generations")
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

  // Structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BigLotto.ai",
    "applicationCategory": "UtilityApplication",
    "description": "AI-powered lottery number generator for Powerball and Mega Millions with advanced analytics and win tracking.",
    "url": "https://biglotto.ai",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-powered number generation",
      "Win tracking and analytics",
      "Monthly predictions",
      "Luck meter and streaks"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {recentWinningNumbers && recentWinningNumbers.length > 0 && (
              <RecentWinningNumbers recentWinningNumbers={recentWinningNumbers} />
            )}
          </AnimatePresence>

          <WelcomeHeader 
            session={session} 
            monthlyGenerations={monthlyGenerations} 
          />

          <LotterySection 
            session={session} 
            monthlyGenerations={monthlyGenerations} 
          />

          {!session?.user && (
            <div className="mt-12 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Join Our Community & Get More Free Generations!
              </h2>
              <p className="text-gray-600">
                Sign up now and use referral codes to get <span className="font-semibold text-purple-600">10 extra free generations</span>. 
                Invite your friends and both of you will receive bonus predictions!
              </p>
            </div>
          )}

          {session?.user && (
            <ReferralSection userId={session.user.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
