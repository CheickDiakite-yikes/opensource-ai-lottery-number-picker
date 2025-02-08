
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LotteryNumber } from "./LotteryNumber";
import { Button } from "@/components/ui/button";
import { Share2, Star, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Star 
                className={`w-6 h-6 ${
                  isPowerball 
                    ? "text-lottery-powerball" 
                    : "text-lottery-megamillions"
                }`} 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isPowerball 
                  ? "Powerball: Match all 5 numbers plus the Powerball to win the jackpot!" 
                  : "Mega Millions: Match all 5 numbers plus the Mega Ball to win the jackpot!"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <p className="text-gray-600 mb-8">{description}</p>
      
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-4 mb-8 justify-center"
          >
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-16 h-16 rounded-full" />
            ))}
          </motion.div>
        ) : numbers.length > 0 ? (
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
        ) : null}
      </AnimatePresence>

      <div className="space-y-4">
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

        <AnimatePresence>
          {numbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-2 group"
              >
                {isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Regenerating...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 14, -8, 14, -4, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <Wand2 className="w-5 h-5" />
                    </motion.div>
                    <span>Regenerate Numbers</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleShare}
                variant="secondary"
                className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Numbers
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
