
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
      className={`relative flex items-center justify-center w-12 h-12 rounded-full 
        ${isPowerball 
          ? "bg-lottery-powerball text-white" 
          : "bg-white shadow-lg"
        } font-bold text-xl`}
    >
      {number}
    </motion.div>
  );
};
