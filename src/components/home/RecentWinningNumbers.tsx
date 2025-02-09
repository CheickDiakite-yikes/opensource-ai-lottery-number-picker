
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface RecentWinningNumbersProps {
  recentWinningNumbers: Array<{
    id: string;
    game_type: string;
    numbers: number[];
    special_number: number;
    draw_date: string;
  }> | null;
}

export const RecentWinningNumbers = ({ recentWinningNumbers }: RecentWinningNumbersProps) => {
  if (!recentWinningNumbers || recentWinningNumbers.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Latest Winning Numbers</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {recentWinningNumbers.map((draw) => (
          <motion.div
            key={draw.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold capitalize">{draw.game_type}</h3>
              <span className="text-sm text-gray-500">
                {format(new Date(draw.draw_date), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {draw.numbers.map((num: number, idx: number) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium"
                  >
                    {num}
                  </motion.span>
                ))}
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lottery-powerball text-white text-sm font-medium ml-2"
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
