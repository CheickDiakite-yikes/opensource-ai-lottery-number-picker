
export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <section className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold mb-4">Win-Sharing Agreement</h2>
        <p className="mb-4">
          By using BigLotto.ai's number generation service, you explicitly agree to our win-sharing terms. 
          Any lottery wins exceeding $1,000 that result from numbers generated through our platform are 
          subject to a 10% win-sharing fee payable to BigLotto.ai.
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
      </section>
    </div>
  );
};

export default Terms;
