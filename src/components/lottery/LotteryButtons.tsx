
import { Button } from "@/components/ui/button";
import { Share2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LotteryButtonsProps {
  numbers: number[];
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
  onShare: () => Promise<void>;
}

export const LotteryButtons = ({ 
  numbers, 
  isGenerating, 
  onGenerate, 
  onShare 
}: LotteryButtonsProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full min-h-[3rem] sm:h-12 text-base sm:text-lg font-semibold transition-all duration-300 bg-lottery-powerball hover:bg-lottery-powerball/90 shadow-lg shadow-lottery-powerball/30 text-white active:scale-95 touch-manipulation"
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
            className="space-y-2 sm:space-y-3"
          >
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              variant="outline"
              className="w-full min-h-[3rem] sm:h-12 text-base sm:text-lg font-semibold border-2 group active:scale-95 touch-manipulation"
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
                    <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <span>Regenerate Numbers</span>
                </div>
              )}
            </Button>

            <Button
              onClick={onShare}
              variant="secondary"
              className="w-full min-h-[3rem] sm:h-12 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Share Numbers
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

