
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
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full 
        ${isPowerball 
          ? "bg-lottery-powerball text-white shadow-lg shadow-lottery-powerball/30" 
          : "bg-white shadow-lg"
        } font-bold text-lg sm:text-xl md:text-2xl cursor-help active:scale-95 touch-manipulation`}
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
