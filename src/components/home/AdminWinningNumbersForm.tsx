
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AdminWinningNumbersFormProps {
  refetch: () => void;
}

export const AdminWinningNumbersForm = ({ refetch }: AdminWinningNumbersFormProps) => {
  const [numbers, setNumbers] = useState<string>("");
  const [specialNumber, setSpecialNumber] = useState<string>("");
  const [gameType, setGameType] = useState<string>("powerball");
  const { toast } = useToast();

  const handleAddWinningNumbers = async () => {
    try {
      const numbersArray = numbers.split(',').map(n => parseInt(n.trim()));
      const specialNumberInt = parseInt(specialNumber);

      if (numbersArray.length !== 5 || isNaN(specialNumberInt)) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Please enter 5 comma-separated numbers and a special number",
        });
        return;
      }

      const { error } = await supabase
        .from('winning_numbers')
        .insert({
          numbers: numbersArray,
          special_number: specialNumberInt,
          game_type: gameType,
          draw_date: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Winning numbers added successfully",
      });

      setNumbers("");
      setSpecialNumber("");
      refetch();
    } catch (error) {
      console.error("Error adding winning numbers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add winning numbers",
      });
    }
  };

  return (
    <section className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Admin: Add Winning Numbers</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Numbers (comma-separated)</label>
            <Input
              placeholder="e.g. 1,2,3,4,5"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Special Number</label>
            <Input
              placeholder="e.g. 6"
              value={specialNumber}
              onChange={(e) => setSpecialNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="p-2 border rounded"
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            <option value="powerball">Powerball</option>
            <option value="mega_millions">Mega Millions</option>
          </select>
          <Button onClick={handleAddWinningNumbers}>Add Winning Numbers</Button>
        </div>
      </div>
    </section>
  );
};
