
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RecentWinningNumbersProps {
  recentWinningNumbers: Array<{
    id: string;
    game_type: string;
    numbers: number[];
    special_number: number;
    draw_date: string;
    next_draw: string;
  }>;
  refetch: () => void;
}

export const RecentWinningNumbers = ({ recentWinningNumbers, refetch }: RecentWinningNumbersProps) => {
  const [timeToNextDraw, setTimeToNextDraw] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    // Function to update timers
    const updateTimers = () => {
      const newTimes: {[key: string]: string} = {};
      recentWinningNumbers.forEach((draw) => {
        const nextDraw = new Date(draw.next_draw);
        if (nextDraw > new Date()) {
          newTimes[draw.id] = formatDistanceToNow(nextDraw, { addSuffix: true });
        }
      });
      setTimeToNextDraw(newTimes);
    };

    // Initial update
    updateTimers();

    // Set up intervals for updates
    const timerInterval = setInterval(updateTimers, 1000 * 60); // Update every minute
    const refetchInterval = setInterval(refetch, 1000 * 60 * 5); // Refetch data every 5 minutes

    return () => {
      clearInterval(timerInterval);
      clearInterval(refetchInterval);
    };
  }, [recentWinningNumbers, refetch]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 sm:mb-12"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Latest Winning Numbers</h2>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {recentWinningNumbers.map((draw) => (
          <motion.div
            key={draw.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold capitalize text-gray-800">
                {draw.game_type.toLowerCase() === 'powerball' ? 'Powerball' : 'Mega Millions'}
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {format(new Date(draw.draw_date), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {draw.numbers.map((num: number, idx: number) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 text-gray-800 font-semibold text-sm sm:text-lg shadow-sm"
                  >
                    {num}
                  </motion.span>
                ))}
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white text-sm sm:text-lg font-semibold shadow-sm ${
                  draw.game_type.toLowerCase() === 'powerball' ? 'bg-lottery-powerball' : 'bg-lottery-megamillions'
                }`}
              >
                {draw.special_number}
              </motion.span>
            </div>
            {timeToNextDraw[draw.id] && (
              <div className="text-sm text-gray-600 mt-2">
                Next draw: {timeToNextDraw[draw.id]}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
