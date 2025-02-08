
import { LotteryCard } from "@/components/LotteryCard";
import { generateLotteryNumbers } from "@/services/lotteryService";

const Index = () => {
  return (
    <div className="min-h-screen bg-lottery-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Lottery Number Generator</h1>
          <p className="text-gray-600">
            Generate your lucky numbers using advanced AI predictions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <LotteryCard
            title="Powerball"
            description="Generate 5 numbers (1-69) + 1 Powerball number (1-26)"
            isPowerball
            onGenerate={() => generateLotteryNumbers("powerball")}
          />
          <LotteryCard
            title="Mega Millions"
            description="Generate 5 numbers (1-70) + 1 Mega Ball number (1-25)"
            onGenerate={() => generateLotteryNumbers("megamillions")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
