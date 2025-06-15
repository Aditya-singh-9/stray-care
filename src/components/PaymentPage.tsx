import React, { useState, useEffect } from 'react';
import { Shield, Lock, Award, Heart, Users, TrendingUp, MapPin } from 'lucide-react';
import Slider from 'react-slick';
import Logpy from '../assets/images/logo-1.jpg';
import PersonalImage1 from '../assets/images/personal-image1.jpg';
import PersonalImage2 from '../assets/images/personal-image2.jpg';
import PersonalImage3 from '../assets/images/personal-image3.jpg';
import PersonalImage4 from '../assets/images/personal-image4.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PaymentPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });

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
      prefill: { name: donorInfo.name, email: donorInfo.email, contact: donorInfo.phone },
      notes: { donation_purpose: "Animal Rescue" },
      theme: { color: "#F37254" },
      method: { netbanking: true, card: true, upi: true, wallet: true }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={Logpy} alt="Logo" className="h-14 w-14 rounded-full object-cover border-2 border-amber-400 shadow-md" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">GullyStrayCare</h1>
              <p className="text-sm text-blue-600 font-medium">Compassion in Action</p>
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:text-blue-600">Home</button>
            <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:text-blue-600">About</button>
            <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:text-blue-600">Services</button>
            <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:text-blue-600">Impact</button>
            <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:text-blue-600">Contact</button>
          </nav>
          <button onClick={() => navigate('/payment')} className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition">
            Donate Now
          </button>
        </div>
      </header>

      {/* MAIN PAYMENT SECTION */}
      <main className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        {/* Donation Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border">
          <h2 className="text-3xl font-bold mb-6">Make a Secure Donation</h2>

          <div className="mb-8">
            <label className="block font-semibold mb-4">Select Amount</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {predefinedAmounts.map((amt) => (
                <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`p-4 rounded-xl border font-semibold ${selectedAmount === amt && !customAmount ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md' : 'border-gray-200 hover:border-amber-300'}`}>
                  ₹{amt}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Custom Amount (₹)" value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full p-4 border rounded-xl focus:ring-amber-500 text-lg"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-4">Donor Information</label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name *" value={donorInfo.name}
                onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                className="p-4 border rounded-xl" required />
              <input type="email" placeholder="Email *" value={donorInfo.email}
                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                className="p-4 border rounded-xl" required />
            </div>
            <input type="tel" placeholder="Phone *" value={donorInfo.phone}
              onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
              className="w-full p-4 border rounded-xl" required />
          </div>

          <button onClick={handleDonation}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:scale-105 transition">
            <Lock className="h-5 w-5 mr-2" /> Donate ₹{customAmount || selectedAmount} 
          </button>

          <div className="flex justify-center mt-4 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500 mr-2" /> SSL Encrypted • PCI DSS Compliant
          </div>
        </div>

        {/* Sidebar with Image Slider */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Award className="h-6 w-6 text-amber-500 mr-2" /> MEMORIES
            </h4>
            <Slider {...sliderSettings}>
              <img src={PersonalImage1} alt="Memory 1" className="rounded-xl w-full object-cover" />
              <img src={PersonalImage2} alt="Memory 2" className="rounded-xl w-full object-cover" />
              <img src={PersonalImage3} alt="Memory 3" className="rounded-xl w-full object-cover" />
              <img src={PersonalImage4} alt="Memory 4" className="rounded-xl w-full object-cover" />
            </Slider>
          </div>

          {/* Your Impact Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <Award className="h-6 w-6 text-amber-500 mr-2" /> Your Impact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 font-bold">₹100</div>
                <div>
                  <p className="font-semibold">Feeds 5 street dogs</p>
                  <p className="text-sm text-gray-500">Nutritious meals</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-500 font-bold">₹500</div>
                <div>
                  <p className="font-semibold">Basic medical care</p>
                  <p className="text-sm text-gray-500">Vaccines & treatment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">₹2500</div>
                <div>
                  <p className="font-semibold">Emergency surgery</p>
                  <p className="text-sm text-gray-500">Life-saving procedures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Our Impact In Numbers */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 py-20 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
        <p className="text-lg mb-10">Every number represents a life saved, a family completed, and a community made more compassionate</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-blue-600 rounded-xl p-8 shadow-lg">
            <Heart className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-3xl font-bold">550</h3>
            <p className="mt-2">Animals Rescued</p>
          </div>
          <div className="bg-blue-600 rounded-xl p-8 shadow-lg">
            <Users className="h-12 w-12 mx-auto text-green-400 mb-4" />
            <h3 className="text-3xl font-bold">223</h3>
            <p className="mt-2">Successful Adoptions</p>
          </div>
          <div className="bg-blue-600 rounded-xl p-8 shadow-lg">
            <TrendingUp className="h-12 w-12 mx-auto text-blue-300 mb-4" />
            <h3 className="text-3xl font-bold">545</h3>
            <p className="mt-2">Sterilizations Done</p>
          </div>
          <div className="bg-blue-600 rounded-xl p-8 shadow-lg">
            <MapPin className="h-12 w-12 mx-auto text-purple-300 mb-4" />
            <h3 className="text-3xl font-bold">12</h3>
            <p className="mt-2">Cities Covered</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPage;
