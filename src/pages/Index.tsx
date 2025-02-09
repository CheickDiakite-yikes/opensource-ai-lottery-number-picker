
import { LotteryCard } from "@/components/LotteryCard";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SparklesIcon, Target, ChartBarIcon, DollarSign, Trophy, Award, Zap } from "lucide-react";
import { format } from "date-fns";

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
    
    return numbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {recentWinningNumbers && recentWinningNumbers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">Latest Winning Numbers</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {recentWinningNumbers.map((draw) => (
                  <motion.div
                    key={draw.id}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{draw.game_type}</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(draw.draw_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2">
                        {draw.numbers.map((num, idx) => (
                          <motion.span
                            key={idx}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium"
                          >
                            {num}
                          </motion.span>
                        ))}
                      </div>
                      <motion.span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lottery-powerball text-white text-sm font-medium ml-2"
                      >
                        {draw.special_number}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-lottery-powerball via-purple-500 to-lottery-megamillions bg-clip-text text-transparent">
              AI Lottery Number Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Harness the power of artificial intelligence to generate your lucky numbers. Try it now for free!
            </p>
            {!session?.user ? (
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-semibold mb-8 text-gray-800 bg-gradient-to-r from-lottery-powerball to-lottery-megamillions bg-clip-text text-transparent">
                    Unlock the Full Potential of AI Predictions
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100"
                    >
                      <div className="mb-4">
                        <SparklesIcon className="h-8 w-8 text-lottery-powerball mx-auto" />
                      </div>
                      <h3 className="font-medium mb-2">Free Generation</h3>
                      <p className="text-sm text-gray-600">Try our AI generator without an account</p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100"
                    >
                      <div className="mb-4">
                        <Target className="h-8 w-8 text-lottery-megamillions mx-auto" />
                      </div>
                      <h3 className="font-medium mb-2">20 Monthly Generations</h3>
                      <p className="text-sm text-gray-600">Get AI-powered predictions every month</p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100"
                    >
                      <div className="mb-4">
                        <ChartBarIcon className="h-8 w-8 text-purple-500 mx-auto" />
                      </div>
                      <h3 className="font-medium mb-2">Advanced Analytics</h3>
                      <p className="text-sm text-gray-600">Track numbers and view insights</p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100"
                    >
                      <div className="mb-4">
                        <DollarSign className="h-8 w-8 text-green-500 mx-auto" />
                      </div>
                      <h3 className="font-medium mb-2">Win Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor your wins and earnings</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mb-12">
                <p className="text-sm text-gray-600">
                  Monthly Generations: {monthlyGenerations}/20
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">Streak: 3 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">Level: Beginner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Luck Meter: 65%</span>
                  </div>
                </div>
              </div>
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
