import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Award, Heart, Users, TrendingUp, MapPin, Star, ArrowRight, CheckCircle, Camera, Play } from 'lucide-react';

import PersonalImage1 from '../assets/images/personal-image1.jpg';
import PersonalImage2 from '../assets/images/personal-image2.jpg';
import PersonalImage3 from '../assets/images/personal-image3.jpg';
import PersonalImage4 from '../assets/images/personal-image4.jpg';
import Logo from '../assets/images/logo-1.jpg';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const navigate = useNavigate();

  const predefinedAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [taxExemption, setTaxExemption] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // ✅ Load Razorpay script safely
  useEffect(() => {
    const scriptId = 'razorpay-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const validateFields = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!donorInfo.name || !donorInfo.email || !donorInfo.phone || isNaN(amount) || amount <= 0) {
      setError('Please fill all required fields and enter a valid amount.');
      return false;
    }

    if (!emailRegex.test(donorInfo.email)) {
      setError('Invalid email address.');
      return false;
    }

    if (!phoneRegex.test(donorInfo.phone)) {
      setError('Invalid 10-digit phone number.');
      return false;
    }

    if (taxExemption && (!pan || !aadhaar || !address)) {
      setError('PAN, Aadhaar, and address are required for 80G exemption.');
      return false;
    }

    setError(null);
    return true;
  };

  const handlePayment = () => {
    if (!scriptLoaded || !window.Razorpay) {
      alert('Payment gateway not loaded yet. Please try again in a moment.');
      return;
    }

    if (!validateFields()) return;

    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    const options = {
      key: 'rzp_live_9ZPuTwlbYq5GZo',
      amount: amount * 100,
      currency: 'INR',
      name: 'GullyStray Care',
      description: 'Thank you for your contribution',
      image: Logo,
      handler: function (response: any) {
        navigate('/thank-you', {
          state: {
            name: donorInfo.name,
            amount: amount,
            paymentId: response.razorpay_payment_id,
          },
        });
      },
      prefill: {
        name: donorInfo.name,
        email: donorInfo.email,
        contact: donorInfo.phone,
      },
      notes: {
        donation_purpose: 'Animal Rescue',
        pan,
        aadhaar,
        address,
      },
      theme: { color: '#F37254' },
      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
      },
      modal: {
        escape: true,
        ondismiss: () => alert('Payment was cancelled.'),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment Failed:', response.error);
      alert('Payment failed. Please try again.');
    });

    rzp.open();
  };

  const impactStats = [
    { icon: Heart, num: 550, label: 'Animals Rescued', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Users, num: 223, label: 'Successful Adoptions', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: TrendingUp, num: 545, label: 'Sterilizations Done', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: MapPin, num: 12, label: 'Cities Covered', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const memoryImages = [
    { src: PersonalImage1, title: "Rescue Mission", subtitle: "Emergency response in Mumbai", type: "photo" },
    { src: PersonalImage2, title: "Medical Care", subtitle: "Life-saving surgery", type: "photo" },
    { src: PersonalImage3, title: "Happy Adoption", subtitle: "Bruno finds his forever home", type: "video" },
    { src: PersonalImage4, title: "Community Outreach", subtitle: "Awareness program", type: "photo" },
    { src: PersonalImage1, title: "Feeding Drive", subtitle: "Daily nutrition program", type: "photo" },
    { src: PersonalImage2, title: "Vaccination Camp", subtitle: "Preventive healthcare", type: "photo" },
    { src: PersonalImage3, title: "Volunteer Training", subtitle: "Building our team", type: "video" },
    { src: PersonalImage4, title: "Success Story", subtitle: "From streets to love", type: "photo" },
  ];

  const impactItems = [
    { amount: "₹100", impact: "Feeds 5 street dogs for a day", icon: Heart, color: "text-orange-500" },
    { amount: "₹500", impact: "Basic medical care & vaccination", icon: Shield, color: "text-green-500" },
    { amount: "₹1000", impact: "Emergency rescue operation", icon: TrendingUp, color: "text-blue-500" },
    { amount: "₹2500", impact: "Life-saving surgery", icon: Award, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={Logo} alt="Logo" className="h-14 w-14 rounded-full border-2 border-blue-200 shadow-md" />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900">GullyStrayCare</h1>
              <p className="text-sm text-blue-600 font-medium">Compassion in Action</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Impact', 'Contact'].map((item) => (
              <a key={item} href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex min-h-screen">
        {/* LEFT SIDE - Payment & Impact (70%) */}
        <div className="w-full lg:w-[70%] p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full text-blue-800 font-medium mb-4">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Make a Difference Today
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Support Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Mission</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every donation helps us rescue, rehabilitate, and rehome street animals across India
              </p>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-blue-600" />
                Secure Donation
              </h2>
              
              {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Choose Amount</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`relative p-4 rounded-xl border-2 font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedAmount === amt && !customAmount
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-2xl font-bold">₹{amt}</div>
                      {selectedAmount === amt && !customAmount && (
                        <CheckCircle className="absolute -top-2 -right-2 h-6 w-6 text-blue-500 bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-lg transition-all duration-200"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">INR</div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Donor Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={taxExemption} 
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">Claim 80G Tax Exemption</span>
                    <p className="text-sm text-gray-600">Get tax benefits on your donation</p>
                  </div>
                </label>
                
                {taxExemption && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <input 
                      type="text" 
                      placeholder="PAN Number *" 
                      value={pan} 
                      onChange={(e) => setPan(e.target.value)} 
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" 
                    />
                    <input 
                      type="text" 
                      placeholder="Aadhaar Number *" 
                      value={aadhaar} 
                      onChange={(e) => setAadhaar(e.target.value)} 
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" 
                    />
                    <textarea 
                      rows={3} 
                      placeholder="Complete Address *" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none" 
                    />
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-5 rounded-xl font-bold text-lg flex justify-center items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Lock className="h-6 w-6 mr-3" /> 
                Donate ₹{customAmount || selectedAmount} Securely
                <ArrowRight className="h-6 w-6 ml-3" />
              </button>

              <div className="mt-6 flex justify-center items-center text-sm text-gray-600">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                <span>256-bit SSL Encrypted • PCI DSS Compliant • Trusted by 10,000+ donors</span>
              </div>
            </div>

            {/* Impact Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-6 w-6 mr-3 text-yellow-500" />
                Your Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {impactItems.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">{item.amount}</div>
                      <div className="text-gray-600">{item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className={`${stat.bg} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex justify-center mb-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.num}+</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Memories Gallery (30%) */}
        <div className="hidden lg:block w-[30%] bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Header */}
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center">
                  <Camera className="h-6 w-6 mr-3 text-yellow-400" />
                  Our Memories
                </h3>
                <p className="text-blue-200 mt-1">Stories of hope and transformation</p>
              </div>
              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                <span className="text-sm font-semibold">View All</span>
              </button>
            </div>
          </div>

          {/* Scrollable Gallery */}
          <div className="relative z-10 h-full overflow-y-auto pb-20 px-6">
            <div className="space-y-6">
              {memoryImages.map((memory, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={memory.src} 
                      alt={memory.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Play button for videos */}
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="text-lg font-bold mb-1">{memory.title}</h4>
                      <p className="text-sm text-gray-200 opacity-90">{memory.subtitle}</p>
                      
                      {/* Engagement indicators */}
                      <div className="flex items-center mt-3 space-x-4 text-xs">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-400" />
                          <span>{Math.floor(Math.random() * 100) + 50}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          <span>4.{Math.floor(Math.random() * 9) + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load more button */}
            <div className="mt-8 text-center">
              <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium">
                Load More Memories
              </button>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">2,847</div>
                <div className="text-sm text-blue-200">Memories Captured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;