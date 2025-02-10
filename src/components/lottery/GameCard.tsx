
import { LotteryCard } from "@/components/LotteryCard";

interface GameCardProps {
  type: "powerball" | "megamillions";
  onGenerate: (type: "powerball" | "megamillions") => Promise<number[]>;
}

export const GameCard = ({ type, onGenerate }: GameCardProps) => {
  const config = {
    powerball: {
      title: "Powerball",
      description: "Generate 5 numbers (1-69) + 1 Powerball number (1-26)",
      isPowerball: true,
    },
    megamillions: {
      title: "Mega Millions",
      description: "Generate 5 numbers (1-70) + 1 Mega Ball number (1-25)",
      isPowerball: false,
    },
  };

  const { title, description, isPowerball } = config[type];

  return (
    <LotteryCard
      title={title}
      description={description}
      isPowerball={isPowerball}
      onGenerate={() => onGenerate(type)}
    />
  );
};
