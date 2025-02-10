
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw } from "lucide-react";
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
    <div className="space-y-3">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full h-12 text-lg font-semibold bg-lottery-powerball hover:bg-lottery-powerball/90 text-white shadow-lg shadow-lottery-powerball/20"
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
            className="space-y-3"
          >
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              variant="outline"
              className="w-full h-12 text-lg font-semibold border-2"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Regenerate Numbers
            </Button>

            <Button
              onClick={onShare}
              variant="secondary"
              className="w-full h-12 text-lg font-semibold bg-gray-50 hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Numbers
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
