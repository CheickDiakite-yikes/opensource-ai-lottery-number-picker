
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface GameGenerations {
  powerball: number;
  megamillions: number;
}

interface AnonymousUserAlertProps {
  anonymousGenerations: GameGenerations;
}

export const AnonymousUserAlert = ({ anonymousGenerations }: AnonymousUserAlertProps) => {
  return (
    <Alert className="bg-white/50 backdrop-blur-lg border-none shadow-lg overflow-hidden">
      <AlertDescription className="p-4">
        <motion.div 
          className="flex flex-col space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Free Generations Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <span className="text-lg font-medium whitespace-nowrap">Get</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                5 free generations
              </Badge>
              <span className="text-lg font-medium">per game</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full">
              <motion.div 
                className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2.5 shadow-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-lottery-powerball animate-pulse" />
                <span className="font-medium">
                  Powerball: {5 - anonymousGenerations.powerball} left
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2.5 shadow-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-lottery-megamillions animate-pulse" />
                <span className="font-medium">
                  Mega Millions: {5 - anonymousGenerations.megamillions} left
                </span>
              </motion.div>
            </div>
          </div>
          
          {/* Sign Up Benefits Section */}
          <div className="flex flex-col space-y-4 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Lock className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-lg font-medium whitespace-nowrap">Sign up for</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                20 monthly generations
              </Badge>
            </div>
            
            <motion.div 
              className="flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2.5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Earn bonus generations through referrals!
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AlertDescription>
    </Alert>
  );
};
