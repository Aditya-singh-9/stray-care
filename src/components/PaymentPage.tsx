import React, { useState, useEffect } from 'react';
import { Heart, Shield, CheckCircle, CreditCard, ArrowLeft, Lock, Award } from 'lucide-react';
import Logpy from '../assets/images/logo-1.jpg';

const PaymentPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const predefinedAmounts = [100, 500, 1000, 2500, 5000];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleDonation = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    if (!donorInfo.name || !donorInfo.email || !donorInfo.phone) {
      alert('Please fill all donor details.');
      return;
    }

    const options = {
      key: 'rzp_live_9ZPuTwlbYq5GZo',
      amount: amount * 100,
      currency: "INR",
      name: "GullyStray Care",
      description: "Thank you for your contribution",
      image: Logpy, 
      handler: function (response: any) {
        alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
        console.log("Payment Details:", response);
      },
      prefill: {
        name: donorInfo.name,
        email: donorInfo.email,
        contact: donorInfo.phone
      },
      notes: {
        donation_purpose: "Animal Rescue"
      },
      theme: { color: "#F37254" },
      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const goBack = () => window.close();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={Logpy} alt="Logo" className="h-14 w-14 rounded-full object-cover border-2 border-amber-400 shadow-md" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">GullyStray Care</h1>
              <p className="text-sm text-blue-600 font-medium">Secure Donation Portal</p>
            </div>
          </div>
          <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        
        {/* Donation Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border">
          <h2 className="text-3xl font-bold mb-6">Make a Secure Donation</h2>

          {/* Amount Selection */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Select Amount</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`p-4 rounded-xl border font-semibold ${
                    selectedAmount === amt && !customAmount ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md' : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom Amount (₹)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full p-4 border rounded-xl focus:ring-amber-500 text-lg"
            />
          </div>

          {/* Donor Information */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Donor Information</label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name *" value={donorInfo.name} onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})} className="p-4 border rounded-xl" required />
              <input type="email" placeholder="Email *" value={donorInfo.email} onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})} className="p-4 border rounded-xl" required />
            </div>
            <input type="tel" placeholder="Phone *" value={donorInfo.phone} onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})} className="w-full p-4 border rounded-xl" required />
          </div>

          {/* Donate Button */}
          <button onClick={handleDonation} className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:scale-105 transition">
            <Lock className="h-5 w-5 mr-2" /> Donate ₹{customAmount || selectedAmount} Securely
          </button>

          <div className="flex justify-center mt-4 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500 mr-2" /> SSL Encrypted • PCI DSS Compliant
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Impact Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Award className="h-6 w-6 text-amber-500 mr-2" /> Your Impact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-600 font-bold">₹100</span>
                </div>
                <div>
                  <p>Feeds 5 street dogs</p>
                  <p className="text-sm text-gray-600">Nutritious meals</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">₹500</span>
                </div>
                <div>
                  <p>Basic medical care</p>
                  <p className="text-sm text-gray-600">Vaccines & treatment</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">₹2500</span>
                </div>
                <div>
                  <p>Emergency surgery</p>
                  <p className="text-sm text-gray-600">Life-saving procedures</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Benefits */}
          <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-6 text-white">
            <h4 className="text-xl font-bold mb-3 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" /> Tax Benefits
            </h4>
            <p className="mb-4">Donation qualifies under 80G Income Tax Act.</p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="font-medium">✓ 80G Tax Certificate</p>
              <p className="font-medium">✓ Instant Receipt</p>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="h-6 w-6 text-blue-500 mr-2" /> Security Promise
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> SSL Encryption</div>
              <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> PCI DSS Compliant</div>
              <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> No Card Stored</div>
              <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Instant Receipt</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
