
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LotteryNumber } from "@/hooks/useLotteryHistory";

interface LotteryHistoryTableProps {
  lotteryHistory: LotteryNumber[] | undefined;
  onRefresh: () => void;
  onMarkAsUsed: (id: string) => void;
}

export const LotteryHistoryTable = ({
  lotteryHistory,
  onRefresh,
  onMarkAsUsed,
}: LotteryHistoryTableProps) => {
  const formatNumbers = (numbers: number[], specialNumber: number) => {
    return `${numbers.join(", ")} + ${specialNumber}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Lottery Numbers</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Numbers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotteryHistory?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="capitalize">
                  {entry.game_type === "powerball" ? "Powerball" : "Mega Millions"}
                </TableCell>
                <TableCell>
                  {formatNumbers(entry.numbers, entry.special_number)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.is_used
                        ? "bg-gray-100 text-gray-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {entry.is_used ? "Used" : "Available"}
                  </span>
                </TableCell>
                <TableCell>
                  {entry.is_winner ? (
                    <span className="text-green-600 font-medium">
                      Won ${entry.prize_amount?.toFixed(2)}
                    </span>
                  ) : entry.checked_at ? (
                    <span className="text-gray-500">No win</span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!entry.is_used && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onMarkAsUsed(entry.id)}
                    >
                      Mark as Used
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!lotteryHistory || lotteryHistory.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-500">
                    No lottery numbers generated yet. Generate some numbers on the
                    home page!
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
