
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LotteryHeaderProps {
  title: string;
  description: string;
  isPowerball?: boolean;
}

export const LotteryHeader = ({ title, description, isPowerball }: LotteryHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Star 
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isPowerball 
                    ? "text-lottery-powerball" 
                    : "text-lottery-megamillions"
                }`} 
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm sm:text-base">
                {isPowerball 
                  ? "Powerball: Match all 5 numbers plus the Powerball to win the jackpot!" 
                  : "Mega Millions: Match all 5 numbers plus the Mega Ball to win the jackpot!"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>
      
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">{description}</p>
    </>
  );
};
