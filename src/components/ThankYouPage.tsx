import { useLocation } from 'react-router-dom';
import { CheckCircle, Download, Share2, Heart, Home } from 'lucide-react';

const ThankYouPage = () => {
  const location = useLocation();
  const { name, amount, paymentId, orderId, signature } = location.state || {};

  const handleDownloadReceipt = () => {
    // In production, this would generate and download a proper receipt
    const receiptData = {
      donorName: name,
      amount: amount,
      paymentId: paymentId,
      orderId: orderId,
      date: new Date().toLocaleDateString(),
      organization: 'GullyStrayCare'
    };
    
    console.log('Receipt data:', receiptData);
    alert('Receipt download functionality will be implemented with backend integration.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just donated to GullyStrayCare!',
        text: `I donated ₹${amount} to help rescue street animals. Join me in making a difference!`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just donated ₹${amount} to GullyStrayCare to help rescue street animals! Join me in making a difference: ${window.location.origin}`;
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 px-4 py-10">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 lg:p-12 text-center border-2 border-green-200">
        
        {/* Success Icon Animation */}
        <div className="animate-bounce mb-8">
          <div className="bg-green-100 rounded-full p-6 inline-block">
            <CheckCircle className="text-green-600 h-16 w-16" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-green-700 mb-4">
          Thank You, {name || 'Donor'}! 
        </h1>
        
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-8">
          <p className="text-xl lg:text-2xl text-gray-800 mb-2">
            Your donation of <span className="font-bold text-green-600 text-2xl lg:text-3xl">₹{amount}</span> was successful!
          </p>
          
          {/* Payment Details */}
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Payment ID:</span> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{paymentId}</span></p>
            {orderId && orderId !== 'N/A' && (
              <p><span className="font-semibold">Order ID:</span> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>
            )}
            <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Impact Message */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border-l-4 border-amber-400">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-amber-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Your Impact</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Your generous contribution will help us rescue, treat, and rehabilitate street animals in need. 
            Every rupee makes a difference in saving lives and creating a more compassionate world.
          </p>
        </div>

        {/* Quote */}
        <blockquote className="italic text-lg text-gray-700 mb-8 border-l-4 border-blue-400 pl-6">
          "The smallest act of kindness is worth more than the grandest intention."
        </blockquote>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleDownloadReceipt}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Receipt
          </button>
          
          <button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Your Good Deed
          </button>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 pt-8">
          <a
            href="/"
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white py-4 px-8 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            <Home className="h-6 w-6 mr-3" />
            Return to Home
          </a>
          
          <p className="text-gray-600 mt-4 text-sm">
            You will receive an email confirmation and 80G tax certificate (if applicable) within 24-48 hours.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Email confirmation sent to your registered email</li>
            <li>• 80G tax certificate (if requested) within 7 days</li>
            <li>• Monthly impact reports to track your contribution</li>
            <li>• Invitation to volunteer and adoption events</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;