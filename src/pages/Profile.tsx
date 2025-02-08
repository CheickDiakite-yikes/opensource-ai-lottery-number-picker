
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface LotteryNumber {
  id: string;
  game_type: string;
  numbers: number[];
  special_number: number;
  created_at: string;
  is_used: boolean;
  is_winner: boolean;
  prize_amount: number | null;
}

interface WinRate {
  total_plays: number;
  total_wins: number;
  win_rate: number;
  total_earnings: number;
}

interface CommonNumber {
  number: number;
  frequency: number;
}

export default function Profile() {
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: lotteryHistory, refetch } = useQuery({
    queryKey: ["lottery-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lottery_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load lottery history",
        });
        throw error;
      }

      return data as LotteryNumber[];
    },
  });

  const { data: winRate } = useQuery({
    queryKey: ["win-rate"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_win_rate", {
        user_id_param: session?.user.id,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load win rate statistics",
        });
        throw error;
      }

      return data as WinRate;
    },
  });

  const { data: commonNumbers } = useQuery({
    queryKey: ["common-numbers", "powerball"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("most_common_numbers", {
        game_type_param: "powerball",
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load common numbers",
        });
        throw error;
      }

      return data as CommonNumber[];
    },
  });

  const handleMarkAsUsed = async (id: string) => {
    const { error } = await supabase
      .from("lottery_history")
      .update({ is_used: true })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark numbers as used",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Numbers marked as used",
    });
    refetch();
  };

  const formatNumbers = (numbers: number[], specialNumber: number) => {
    return `${numbers.join(", ")} + ${specialNumber}`;
  };

  const chartData = lotteryHistory?.map((entry) => ({
    date: format(new Date(entry.created_at), "MMM d"),
    winAmount: entry.prize_amount || 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Plays</CardTitle>
              <CardDescription>Your lottery activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{winRate?.total_plays || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
              <CardDescription>Success percentage</CardDescription>
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
              <CardDescription>Prize money won</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${winRate?.total_earnings?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
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

        {/* History Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Lottery Numbers</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
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
                          onClick={() => handleMarkAsUsed(entry.id)}
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
                        No lottery numbers generated yet. Generate some numbers on the home page!
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
