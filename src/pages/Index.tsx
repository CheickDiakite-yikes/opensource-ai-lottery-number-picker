
import { LotteryCard } from "@/components/LotteryCard";
import { generateLotteryNumbers } from "@/services/lotteryService";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleGenerate = async (type: "powerball" | "megamillions") => {
    const numbers = await generateLotteryNumbers(type);
    
    try {
      await supabase.from("lottery_history").insert({
        numbers: numbers.slice(0, -1),
        special_number: numbers[numbers.length - 1],
        game_type: type,
      });
    } catch (error) {
      console.error("Error saving numbers:", error);
    }
    
    return numbers;
  };

  return (
    <div className="min-h-screen bg-lottery-background">
      <Navbar />
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-lottery-powerball to-lottery-megamillions bg-clip-text text-transparent">
              AI Lottery Number Generator
            </h1>
            <p className="text-gray-600">
              Generate your lucky numbers using advanced AI predictions
            </p>
          </div>

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
