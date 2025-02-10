
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
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <Star 
          className={`w-6 h-6 ${
            isPowerball 
              ? "text-lottery-powerball" 
              : "text-lottery-megamillions"
          }`} 
        />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
