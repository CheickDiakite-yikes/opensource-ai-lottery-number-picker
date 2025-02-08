
import { motion, AnimatePresence } from "framer-motion";
import { LotteryNumber } from "@/components/lottery/LotteryNumber";
import { Skeleton } from "@/components/ui/skeleton";

interface LotteryNumbersProps {
  numbers: number[];
  isGenerating: boolean;
  isPowerball?: boolean;
}

export const LotteryNumbers = ({ numbers, isGenerating, isPowerball }: LotteryNumbersProps) => {
  return (
    <AnimatePresence mode="wait">
      {isGenerating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center"
        >
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
          ))}
        </motion.div>
      ) : numbers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center"
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
  );
};

