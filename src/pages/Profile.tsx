
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

interface LotteryNumber {
  id: string;
  game_type: string;
  numbers: number[];
  special_number: number;
  created_at: string;
  is_used: boolean;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <TableCell colSpan={5} className="text-center py-8">
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
