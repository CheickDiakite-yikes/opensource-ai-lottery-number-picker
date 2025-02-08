
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WinRate } from "@/hooks/useWinRate";

interface StatisticsCardsProps {
  winRate: WinRate | undefined;
}

export const StatisticsCards = ({ winRate }: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Plays</CardTitle>
          <CardDescription>Numbers marked as used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{winRate?.total_plays || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Win Rate</CardTitle>
          <CardDescription>Success percentage of used numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {winRate?.win_rate || 0}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Earnings</CardTitle>
          <CardDescription>Prize money from winning numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ${winRate?.total_earnings?.toFixed(2) || "0.00"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
