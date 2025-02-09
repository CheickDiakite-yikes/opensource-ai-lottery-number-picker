
import { motion } from "framer-motion";
import { Trophy, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WelcomeHeaderProps {
  session: any;
  monthlyGenerations: {
    monthly_generations: number;
    streak_count: number;
    level: string;
    luck_meter: number;
  } | null | undefined;
}

export const WelcomeHeader = ({ session, monthlyGenerations }: WelcomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-lottery-powerball via-purple-500 to-lottery-megamillions bg-clip-text text-transparent">
        AI Lottery Number Generator
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Harness the power of artificial intelligence to generate your lucky numbers. Try it now for free!
      </p>
      {!session?.user ? (
        <FeaturesGrid />
      ) : (
        <UserStats monthlyGenerations={monthlyGenerations} />
      )}
    </motion.div>
  );
};

const FeaturesGrid = () => (
  <div className="max-w-4xl mx-auto mb-12">
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 bg-gradient-to-r from-lottery-powerball to-lottery-megamillions bg-clip-text text-transparent">
        Unlock the Full Potential of AI Predictions
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<SparklesIcon className="h-8 w-8 text-lottery-powerball mx-auto" />}
          title="Free Generation"
          description="Try our AI generator without an account"
        />
        <FeatureCard
          icon={<Target className="h-8 w-8 text-lottery-megamillions mx-auto" />}
          title="20 Monthly Generations"
          description="Get AI-powered predictions every month"
        />
        <FeatureCard
          icon={<ChartBarIcon className="h-8 w-8 text-purple-500 mx-auto" />}
          title="Advanced Analytics"
          description="Track numbers and view insights"
        />
        <FeatureCard
          icon={<DollarSign className="h-8 w-8 text-green-500 mx-auto" />}
          title="Win Tracking"
          description="Monitor your wins and earnings"
        />
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100"
  >
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="font-medium mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const UserStats = ({ monthlyGenerations }: { monthlyGenerations: WelcomeHeaderProps['monthlyGenerations'] }) => (
  <div className="flex flex-col items-center gap-4 mb-12">
    <p className="text-sm text-gray-600">
      Monthly Generations: {monthlyGenerations?.monthly_generations}/20
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <StatItem
        icon={<Trophy className="h-5 w-5 text-yellow-500" />}
        value={`Streak: ${monthlyGenerations?.streak_count || 0} days`}
        delay={0.1}
      />
      <StatItem
        icon={<Award className="h-5 w-5 text-purple-500" />}
        value={`Level: ${monthlyGenerations?.level || 'Beginner'}`}
        delay={0.2}
      />
      <StatItem
        icon={<Zap className="h-5 w-5 text-blue-500" />}
        value={`Luck Meter: ${monthlyGenerations?.luck_meter || 50}%`}
        delay={0.3}
      />
    </div>
  </div>
);

const StatItem = ({ icon, value, delay }: { icon: React.ReactNode; value: string; delay: number }) => (
  <motion.div 
    className="flex items-center gap-2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    {icon}
    <span className="text-sm">{value}</span>
  </motion.div>
);
