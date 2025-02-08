
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { StatisticsCards } from "@/components/profile/StatisticsCards";
import { StatisticsCharts } from "@/components/profile/StatisticsCharts";
import { LotteryHistoryTable } from "@/components/profile/LotteryHistoryTable";
import { useLotteryHistory } from "@/hooks/useLotteryHistory";
import { useWinRate } from "@/hooks/useWinRate";
import { useCommonNumbers } from "@/hooks/useCommonNumbers";

export default function Profile() {
  const { toast } = useToast();
  const { data: lotteryHistory, refetch } = useLotteryHistory();
  const { data: winRate } = useWinRate();
  const { data: commonNumbers } = useCommonNumbers("powerball");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatisticsCards winRate={winRate} />
        <StatisticsCharts
          lotteryHistory={lotteryHistory}
          commonNumbers={commonNumbers}
        />
        <LotteryHistoryTable
          lotteryHistory={lotteryHistory}
          onRefresh={refetch}
          onMarkAsUsed={handleMarkAsUsed}
        />
      </main>
    </div>
  );
}
