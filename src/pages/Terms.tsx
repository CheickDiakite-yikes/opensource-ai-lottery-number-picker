
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | BigLotto.ai - AI-Powered Lottery Number Generation</title>
        <meta name="description" content="Learn about BigLotto.ai's terms of service, win-sharing agreement, and how our advanced AI technology powered by OpenAI generates lottery numbers through historical data analysis." />
        <meta name="keywords" content="lottery terms of service, AI lottery predictions, lottery number generation, OpenAI lottery analysis, win-sharing agreement, lottery algorithms" />
        <link rel="canonical" href="https://biglotto.ai/terms" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#8B4513] hover:text-[#A0522D] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <section className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mb-4">AI Technology & Number Generation</h2>
          <p className="mb-4">
            BigLotto.ai utilizes advanced artificial intelligence powered by OpenAI's reasoning models 
            to analyze historical lottery data patterns. Our sophisticated algorithms process and analyze 
            decades of historical lottery numbers, identifying patterns, frequency distributions, and 
            statistical anomalies to generate number combinations with potentially higher winning probability.
          </p>
          <p className="mb-4">
            The AI system considers multiple factors including but not limited to: number frequency, 
            hot and cold numbers, numerical patterns, statistical distributions, and historical winning 
            combinations. While our AI-driven approach provides data-informed number generation, lottery 
            outcomes remain inherently random and unpredictable.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Win-Sharing Agreement</h2>
          <p className="mb-4">
            By using BigLotto.ai's number generation service, you explicitly agree to our win-sharing terms. 
            Any lottery wins exceeding $1,000 that result from numbers generated through our platform are 
            subject to a 10% win-sharing fee payable to BigLotto.ai.
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Generation Limits</h2>
          <p className="mb-4">
            Free users are limited to 5 free generations per game type (Powerball and Mega Millions) per month. 
            Registered users receive 20 monthly generations plus any additional bonus generations earned through 
            referrals. All generation limits reset at the beginning of each month.
          </p>
          <p className="mb-4">
            Referral bonuses add 10 additional generations to both the referrer and the referred user's 
            monthly allowance. These bonus generations stack with your base monthly limit and carry over 
            to subsequent months.
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Service Usage</h2>
          <p className="mb-4">
            Our AI-powered lottery number generation service is provided "as is" without any guarantees 
            or warranties of winning. While our system uses advanced algorithms to generate numbers, 
            lottery outcomes are inherently random and we cannot guarantee wins.
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Limitation of Liability</h2>
          <p className="mb-4">
            BigLotto.ai is not responsible for any losses incurred through the use of our service. 
            Users are responsible for checking and verifying all numbers and participating in lottery 
            games in accordance with their local laws and regulations.
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Payment of Win-Sharing Fee</h2>
          <p className="mb-4">
            The 10% win-sharing fee applies to net winnings after taxes and is due within 30 days 
            of receiving lottery payments. Users must notify BigLotto.ai of any qualifying wins 
            within 7 days of the drawing date.
          </p>

          <h2 className="text-xl font-semibold mb-4 mt-8">Data Analysis Disclaimer</h2>
          <p className="mb-4">
            While our AI technology processes extensive historical data and employs sophisticated 
            analytical models, past performance does not guarantee future results. The randomness 
            of lottery drawings means that any number combination has an equal mathematical probability 
            of being drawn, regardless of historical patterns or AI analysis.
          </p>
        </section>
      </div>
    </>
  );
};

export default Terms;
