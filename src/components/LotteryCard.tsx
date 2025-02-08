
import { useState } from "react";
import { motion } from "framer-motion";
import { LotteryNumber } from "./LotteryNumber";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LotteryCardProps {
  title: string;
  description: string;
  isPowerball?: boolean;
  onGenerate: () => Promise<number[]>;
}

export const LotteryCard = ({ 
  title, 
  description, 
  isPowerball, 
  onGenerate 
}: LotteryCardProps) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newNumbers = await onGenerate();
      setNumbers(newNumbers);
      toast({
        title: "Numbers Generated!",
        description: "Your lucky numbers are ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate numbers. Please try again.",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-lottery-card backdrop-blur-md shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className={`w-6 h-6 ${isPowerball ? "text-lottery-powerball" : "text-lottery-megamillions"}`} />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {numbers.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {numbers.map((number, index) => (
            <LotteryNumber
              key={index}
              number={number}
              isPowerball={index === numbers.length - 1 && isPowerball}
              index={index}
            />
          ))}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-full ${
          isPowerball 
            ? "bg-lottery-powerball hover:bg-lottery-powerball/90" 
            : "bg-lottery-megamillions hover:bg-lottery-megamillions/90"
        } text-white`}
      >
        {isGenerating ? "Generating..." : "Generate Numbers"}
      </Button>
    </motion.div>
  );
};
