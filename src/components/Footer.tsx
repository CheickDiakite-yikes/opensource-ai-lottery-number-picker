
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-4">
            By using our number generation service, you agree that any wins exceeding $1,000 
            resulting from our generated numbers are subject to a 10% win-sharing fee.
          </p>
          <Link 
            to="/terms" 
            className="text-[#8B4513] hover:text-[#A0522D] underline transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BigLotto.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
