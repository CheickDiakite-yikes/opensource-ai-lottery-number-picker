
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LotteryNumber } from "@/hooks/useLotteryHistory";
import { CommonNumber } from "@/hooks/useCommonNumbers";

interface StatisticsChartsProps {
  lotteryHistory: LotteryNumber[] | undefined;
  commonNumbers: CommonNumber[] | undefined;
}

export const StatisticsCharts = ({
  lotteryHistory,
  commonNumbers,
}: StatisticsChartsProps) => {
  const chartData = lotteryHistory?.map((entry) => ({
    date: format(new Date(entry.created_at), "MMM d"),
    winAmount: entry.prize_amount || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
          <CardDescription>Your prize money history</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="winAmount"
                stroke="#16a34a"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Common Numbers</CardTitle>
          <CardDescription>Frequency of numbers drawn</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commonNumbers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="number" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="frequency" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
