
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
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="w-[72px] h-[72px] rounded-full" />
          ))}
        </motion.div>
      ) : numbers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
  );
};
