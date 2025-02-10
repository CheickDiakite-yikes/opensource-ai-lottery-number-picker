
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LotteryNumberProps {
  number: number;
  isPowerball?: boolean;
  index: number;
}

export const LotteryNumber = ({ number, isPowerball, index }: LotteryNumberProps) => {
  const isMobile = useIsMobile();
  
  const content = (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-full 
        ${isPowerball 
          ? "bg-lottery-powerball/90 text-white shadow-lg shadow-lottery-powerball/30" 
          : "bg-white shadow-lg"
        } font-bold text-2xl cursor-help hover:scale-105 transition-transform duration-200`}
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

  if (isMobile) {
    return content;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isPowerball ? 
              `This is the Powerball number (1-26). Match this to win bigger prizes!` :
              `Regular number (1-69). Match all 5 numbers in any order to win!`
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
