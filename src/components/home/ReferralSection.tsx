
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Copy, Share2, Gift } from "lucide-react";

interface ReferralSectionProps {
  userId: string;
}

export const ReferralSection = ({ userId }: ReferralSectionProps) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrCreateReferralCode();
  }, [userId]);

  const fetchOrCreateReferralCode = async () => {
    try {
      // First, try to fetch existing code
      let { data: existingCode } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', userId)
        .single();

      if (existingCode) {
        setReferralCode(existingCode.code);
        return;
      }

      // If no code exists, generate one
      const { data: newCode } = await supabase
        .rpc('generate_unique_referral_code');

      if (newCode) {
        // Save the new code
        await supabase
          .from('referral_codes')
          .insert({ user_id: userId, code: newCode });
        
        setReferralCode(newCode);
      }
    } catch (error) {
      console.error('Error with referral code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate referral code. Please try again later.",
      });
    }
  };

  const copyReferralLink = async () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferralLink = async () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    try {
      await navigator.share({
        title: 'Join me on BigLotto.ai',
        text: 'Use my referral link to get 10 free lottery number generations!',
        url: referralLink,
      });
    } catch (error) {
      // Fall back to copying if share is not supported
      copyReferralLink();
    }
  };

  if (!referralCode) return null;

  return (
    <div className="mt-8 sm:mt-12 overflow-hidden">
      <div className="relative bg-gradient-to-br from-purple-50 to-white p-4 sm:p-8 rounded-3xl shadow-lg border border-purple-100">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-purple-100/50 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-purple-100/50 rounded-full translate-y-24 -translate-x-24 blur-3xl" />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Share the Luck, Double the Rewards
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Invite friends and both get 10 free generations
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Referral Code Section */}
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-2">Your Unique Referral Code</p>
              <div className="font-mono text-base sm:text-lg font-semibold bg-purple-50/50 p-3 rounded-lg text-purple-900 mb-4 break-all">
                {referralCode}
              </div>
              <p className="text-xs text-gray-500">
                Share this code with friends or use the buttons to share directly
              </p>
            </div>

            {/* Share Buttons Section */}
            <div className="flex flex-col justify-center gap-3">
              <Button
                onClick={copyReferralLink}
                variant="outline"
                className="w-full py-4 sm:py-6 text-sm sm:text-base font-medium border-purple-100 hover:bg-purple-50"
              >
                <Copy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-purple-600" />
                Copy Referral Link
              </Button>
              
              <Button
                onClick={shareReferralLink}
                className="w-full py-4 sm:py-6 text-sm sm:text-base font-medium bg-purple-600 hover:bg-purple-700"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                Share with Friends
              </Button>
            </div>
          </div>

          {/* How it Works */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                1
              </div>
              <p className="text-sm text-gray-600">Share your unique referral code with friends</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                2
              </div>
              <p className="text-sm text-gray-600">Friends sign up using your code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                3
              </div>
              <p className="text-sm text-gray-600">Both get 10 extra generations instantly!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
