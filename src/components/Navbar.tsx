
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-lottery-card backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/634f2434-e295-4a6f-8332-4f06f109f9fc.png"
                alt="BIGLOTTO"
                className="h-12 w-auto"
              />
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
          {session ? (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white hover:from-[#A0522D] hover:to-[#8B4513]"
            >
              Sign Up Now
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
