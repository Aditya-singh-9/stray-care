import React, { useState, useEffect } from 'react';
import { Heart, Shield, CheckCircle, Lock, Award } from 'lucide-react';

const Donation: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('monthly');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const predefinedAmounts = [25, 50, 100, 150, 200];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    if (!donorInfo.name || !donorInfo.email || !donorInfo.phone) {
      alert("Please fill all donor details.");
      return;
    }

    try {
      let endpoint = '/api/payment/orders';
      if (donationType === 'monthly') {
        endpoint = '/api/payment/subscription';
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      const options: any = {
        key: 'rzp_live_CVLoRP0AMxJhjw',
        name: "GullyStray Care",
        description: donationType === 'monthly' ? "Monthly Donation" : "Thank you for your contribution",
        image: "",
        handler: async function (response: any) {
          if (donationType === 'monthly') {
            alert("Subscription Successful! Payment ID: " + response.razorpay_payment_id);
            console.log("Subscription response:", response);
            return;
          }

          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResponse.ok) {
              alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
              console.log("Full payment object:", response);
            } else {
              alert(verifyResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification Error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone
        },
        notes: {
          donation_purpose: "Animal Rescue"
        },
        theme: { color: "#F37254" }
      };

      if (donationType === 'monthly') {
        options.subscription_id = data.subscription_id;
      } else {
        options.amount = data.amount;
        options.currency = data.currency;
        options.order_id = data.id;
      }

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <main className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        {/* Donation Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border">
          <h2 className="text-3xl font-bold mb-6">Make a Secure Donation</h2>

          {/* Donation Type Toggle */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Donation Frequency</label>
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setDonationType('monthly')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'monthly'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setDonationType('onetime')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'onetime'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                One-Time
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Select Amount</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`p-4 rounded-xl border font-semibold ${selectedAmount === amt && !customAmount ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md' : 'border-gray-200 hover:border-amber-300'
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

          {/* Donor Info */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Donor Information</label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name *" value={donorInfo.name} onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })} className="p-4 border rounded-xl" required />
              <input type="email" placeholder="Email *" value={donorInfo.email} onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })} className="p-4 border rounded-xl" required />
            </div>
            <input type="tel" placeholder="Phone *" value={donorInfo.phone} onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })} className="w-full p-4 border rounded-xl" required />
          </div>

          {/* Donate Button */}
          <button onClick={handlePayment} className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:scale-105 transition">
            <Lock className="h-5 w-5 mr-2" /> Donate ₹{customAmount || selectedAmount} Securely
          </button>

          <div className="flex justify-center mt-4 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500 mr-2" /> SSL Encrypted • PCI DSS Compliant
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center"><Award className="h-6 w-6 text-amber-500 mr-2" /> Your Impact</h4>
            <div className="space-y-4">
              <div className="flex items-center"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4"><span className="text-amber-600 font-bold">₹100</span></div><div><p>Feeds 5 street dogs</p><p className="text-sm text-gray-600">Nutritious meals</p></div></div>
              <div className="flex items-center"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"><span className="text-green-600 font-bold">₹500</span></div><div><p>Basic medical care</p><p className="text-sm text-gray-600">Vaccines & treatment</p></div></div>
              <div className="flex items-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"><span className="text-blue-600 font-bold">₹2500</span></div><div><p>Emergency surgery</p><p className="text-sm text-gray-600">Life-saving procedures</p></div></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-6 text-white">
            <h4 className="text-xl font-bold mb-3 flex items-center"><CheckCircle className="h-6 w-6 mr-2" /> Tax Benefits</h4>
            <p className="mb-4">Donation qualifies under 80G Income Tax Act.</p>
            <div className="bg-white/20 rounded-lg p-3"><p className="font-medium">✓ 80G Tax Certificate</p><p className="font-medium">✓ Instant Receipt</p></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center"><Shield className="h-6 w-6 text-blue-500 mr-2" /> Security Promise</h4>
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

export default Donation;
