
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        title: "Your lucky numbers are ready! 🎱",
        description: "May the odds be in your favor!",
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
      className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <Star 
          className={`w-6 h-6 ${
            isPowerball 
              ? "text-lottery-powerball" 
              : "text-lottery-megamillions"
          }`} 
        />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <p className="text-gray-600 mb-8">{description}</p>
      
      <AnimatePresence mode="wait">
        {numbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-wrap gap-4 mb-8 justify-center"
          >
            {numbers.map((number, index) => (
              <LotteryNumber
                key={index}
                number={number}
                isPowerball={index === numbers.length - 1 && isPowerball}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
          isPowerball 
            ? "bg-lottery-powerball hover:bg-lottery-powerball/90 shadow-lg shadow-lottery-powerball/30" 
            : "bg-lottery-megamillions hover:bg-lottery-megamillions/90 shadow-lg shadow-lottery-megamillions/30"
        } text-white`}
      >
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </motion.div>
        ) : (
          "Generate Numbers"
        )}
      </Button>
    </motion.div>
  );
};
