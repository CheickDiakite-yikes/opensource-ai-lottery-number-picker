
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export const Navbar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-lottery-card backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-lottery-powerball to-lottery-megamillions bg-clip-text text-transparent">
                AI Lottery
              </h1>
            </Link>
            {session && (
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Numbers
              </Link>
            )}
          </div>
          {session && (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
