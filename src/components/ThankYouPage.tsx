import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md transition-all">
        <CheckCircle className="text-green-500 mx-auto mb-6" size={80} />
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your donation has been successfully received. We truly appreciate your generosity and support for our cause.
        </p>
        <Link to="/" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
