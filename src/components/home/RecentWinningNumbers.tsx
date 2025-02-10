
import { format } from "date-fns";
import { motion } from "framer-motion";

interface RecentWinningNumbersProps {
  recentWinningNumbers: Array<{
    id: string;
    game_type: string;
    numbers: number[];
    special_number: number;
    draw_date: string;
  }>;
}

export const RecentWinningNumbers = ({ recentWinningNumbers }: RecentWinningNumbersProps) => {
  console.log("Rendering RecentWinningNumbers with data:", recentWinningNumbers);
  
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
