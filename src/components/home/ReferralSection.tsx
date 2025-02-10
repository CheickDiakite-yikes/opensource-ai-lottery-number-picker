
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Copy, Share2 } from "lucide-react";

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
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-800">Refer Friends & Get Rewards</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Share your referral code with friends. When they sign up, you both get 10 extra generations!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Your Referral Code</p>
          <p className="font-mono text-lg font-semibold">{referralCode}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={copyReferralLink}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          
          <Button
            onClick={shareReferralLink}
            className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
