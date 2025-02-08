
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { LotteryHeader } from "./lottery/LotteryHeader";
import { LotteryNumbers } from "./lottery/LotteryNumbers";
import { LotteryButtons } from "./lottery/LotteryButtons";

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

  const handleShare = async () => {
    if (numbers.length === 0) return;
    
    const text = `My lucky ${isPowerball ? 'Powerball' : 'Mega Millions'} numbers: ${numbers.slice(0, -1).join(', ')} + ${numbers[numbers.length - 1]}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Lucky Numbers',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard!",
          description: "Share your lucky numbers with friends!",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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
      className="p-4 sm:p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <LotteryHeader 
        title={title} 
        description={description} 
        isPowerball={isPowerball} 
      />
      
      <LotteryNumbers 
        numbers={numbers}
        isGenerating={isGenerating}
        isPowerball={isPowerball}
      />

      <LotteryButtons 
        numbers={numbers}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        onShare={handleShare}
      />
    </motion.div>
  );
};
