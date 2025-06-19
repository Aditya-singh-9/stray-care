import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ThankYouPage = () => {
  const location = useLocation();
  const { name, amount, paymentId } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4 py-10 text-center">
      {/* Success Icon Animation */}
      <div className="animate-pulse mb-6">
        <CheckCircle className="text-green-500" size={80} />
      </div>

      {/* Thank You Message */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">
        Thank You, {name || 'Donor'}! 💚
      </h1>
      <p className="text-lg sm:text-xl text-gray-800 mb-2">
        Your donation of <span className="font-semibold text-green-600">INR {amount}</span> was successful.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Payment ID: <span className="font-mono">{paymentId}</span>
      </p>

      {/* Quote or Feel-Good Message */}
      <blockquote className="italic text-md text-gray-700 max-w-xl mx-auto mb-8">
        "The smallest act of kindness is worth more than the grandest intention."
      </blockquote>

      {/* Call to Action / Navigation */}
      <a
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition transform hover:scale-105"
      >
        Return to Home
      </a>
    </div>
  );
};

export default ThankYouPage;