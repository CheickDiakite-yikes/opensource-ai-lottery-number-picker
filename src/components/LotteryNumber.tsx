
import { motion } from "framer-motion";

interface LotteryNumberProps {
  number: number;
  isPowerball?: boolean;
  index: number;
}

export const LotteryNumber = ({ number, isPowerball, index }: LotteryNumberProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`relative flex items-center justify-center w-16 h-16 rounded-full 
        ${isPowerball 
          ? "bg-lottery-powerball text-white shadow-lg shadow-lottery-powerball/30" 
          : "bg-white shadow-lg"
        } font-bold text-2xl`}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
      >
        {number}
      </motion.span>
    </motion.div>
  );
};
