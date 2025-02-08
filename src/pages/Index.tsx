
import { LotteryCard } from "@/components/LotteryCard";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: monthlyGenerations } = useQuery({
    queryKey: ["monthly-generations"],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_generations")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data.monthly_generations;
    },
    enabled: !!session?.user,
  });

  const handleGenerate = async (type: "powerball" | "megamillions") => {
    // For unauthenticated users, just generate numbers without saving
    if (!session?.user) {
      const numbers = await generateLotteryNumbers(type);
      return numbers;
    }

    // For authenticated users, check monthly limit and save to history
    if (monthlyGenerations >= 20) {
      toast({
        title: "Monthly Limit Reached",
        description: "You've reached your limit of 20 generations this month. Please try again next month.",
        variant: "destructive",
      });
      return [];
    }

    const numbers = await generateLotteryNumbers(type);
    
    try {
      const { error } = await supabase.from("lottery_history").insert({
        numbers: numbers.slice(0, -1),
        special_number: numbers[numbers.length - 1],
        game_type: type,
        user_id: session.user.id
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving numbers:", error);
      toast({
        title: "Error",
        description: "Failed to save your numbers",
        variant: "destructive",
      });
    }
    
    return numbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-lottery-powerball to-lottery-megamillions bg-clip-text text-transparent">
              AI Lottery Number Generator
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Generate your lucky numbers using advanced AI predictions
            </p>
            {!session?.user ? (
              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Try it for free, then unlock more with a free account!
                  </h2>
                  <ul className="text-gray-600 space-y-2 text-left list-none mb-4">
                    <li className="flex items-center">
                      <span className="mr-2">✨</span>
                      Generate numbers without an account
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🎯</span>
                      Sign up to get 20 AI-powered generations per month
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📊</span>
                      Track your numbers and view detailed analytics
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">💰</span>
                      Monitor your wins and track your earnings
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-4">
                Monthly Generations: {monthlyGenerations}/20
              </p>
            )}
          </motion.div>

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
      </div>
    </div>
  );
};

export default Index;
