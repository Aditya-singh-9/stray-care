import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Award, Heart, Users, TrendingUp, MapPin, Phone, Mail, Clock, Globe, Quote, Camera, Play } from 'lucide-react';

import PersonalImage1 from '../assets/images/personal-image1.jpg';
import PersonalImage2 from '../assets/images/personal-image2.jpg';
import PersonalImage3 from '../assets/images/personal-image3.jpg';
import PersonalImage4 from '../assets/images/personal-image4.jpg';
import HeroImg from '../assets/images/hero.jpg';
import AboutImg from '../assets/images/About.jpg';
import ImpactImg from '../assets/images/impact.jpg';
import Logo from '../assets/images/logo-1.jpg';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('monthly');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [taxExemption, setTaxExemption] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
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

  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      alert('Payment gateway not loaded yet. Please try again in a moment.');
      return;
    }

    if (!validateFields()) return;

    setIsProcessing(true);
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Key from environment variable
        name: 'GullyStray Care',
        description: donationType === 'monthly' ? 'Monthly Donation' : 'Donation for Animal Welfare',
        image: Logo,
        handler: async function (response: any) {
          console.log('Payment Success:', response);

          // Verify payment (skip for subscription for now or implement verify endpoint)
          if (donationType === 'onetime') {
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
              if (!verifyResponse.ok) {
                alert(verifyResult.message || 'Payment verification failed');
                return;
              }
            } catch (error) {
              console.error('Verification Error:', error);
            }
          }

          navigate('/thank-you', {
            state: {
              name: donorInfo.name,
              amount: amount,
              paymentId: response.razorpay_payment_id || 'Subscription',
              orderId: response.razorpay_order_id || response.razorpay_subscription_id || 'N/A',
              signature: response.razorpay_signature || 'N/A'
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
          donation_type: donationType,
          donor_name: donorInfo.name,
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone,
          tax_exemption: taxExemption,
          pan: pan || '',
          aadhaar: aadhaar || '',
          address: address || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          escape: true,
          confirm_close: true,
          ondismiss: () => {
            setIsProcessing(false);
            console.log('Payment cancelled by user');
          },
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300,
        remember_customer: false
      };

      if (donationType === 'monthly') {
        options.subscription_id = data.subscription_id;
      } else {
        options.amount = data.amount;
        options.currency = data.currency;
        options.order_id = data.id;
        options.payment_capture = 1;
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        console.error('Payment Failed:', response.error);
        setIsProcessing(false);
        setError('Payment failed. Please try again.');
      });

      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const impactStats = [
    { icon: Heart, num: 550, label: 'Animals Rescued', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Users, num: 223, label: 'Successful Adoptions', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, num: 545, label: 'Sterilizations Done', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: MapPin, num: 12, label: 'Cities Covered', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Veterinary Partner",
      quote: "Working with GullyStrayCare has been incredibly rewarding. Their dedication is unmatched.",
      image: PersonalImage1
    },
    {
      name: "Rajesh Kumar",
      role: "Monthly Donor",
      quote: "The transparency and impact reports give me confidence in supporting this cause.",
      image: PersonalImage2
    },
    {
      name: "Meera Singh",
      role: "Volunteer",
      quote: "Being part of rescue operations has been the most fulfilling experience of my life.",
      image: PersonalImage3
    },
  ];

  const galleryImages = [
    PersonalImage1, PersonalImage2, PersonalImage3, PersonalImage4,
    HeroImg, AboutImg, ImpactImg, PersonalImage1,
    PersonalImage2, PersonalImage3, PersonalImage4, HeroImg
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="GullyStray Care Logo" className="h-12 w-12 rounded-full shadow-sm" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gully StrayCare</h1>
                <p className="text-xs text-blue-600 font-medium">Compassion in Action</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column - Donation Form (Mobile First) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-64 sm:h-80">
                <img
                  src={PersonalImage1}
                  alt="Animal rescue"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Help Us Save Street Animals</h1>
                  <p className="text-lg opacity-90">Every donation helps us rescue, treat, and rehome animals in need</p>
                </div>
              </div>
            </div>

            {/* Donation Form - Now in Middle */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:hidden border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>

              {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Donation Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Donation Frequency</label>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'monthly'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setDonationType('onetime')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'onetime'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    One-Time
                  </button>
                </div>
              </div>

              {/* Select Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[25, 50, 100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all duration-200 text-lg ${selectedAmount === amt && !customAmount
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Your Information */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Information</label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    required
                  />
                </div>
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taxExemption}
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Claim 80G Tax Exemption</span>
                    <p className="text-sm text-gray-600 mt-1">Get tax benefits up to 50% under Section 80G</p>
                  </div>
                </label>

                {taxExemption && (
                  <div className="mt-5 space-y-4">
                    <input
                      type="text"
                      placeholder="PAN Number *"
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                    <input
                      type="text"
                      placeholder="Aadhaar Number *"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                    <textarea
                      rows={3}
                      placeholder="Complete Address with Pincode *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-lg"
                    />
                  </div>
                )}
              </div>

              {/* Donate Now Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-5 rounded-xl font-bold text-xl flex justify-center items-center transition-all duration-300 shadow-lg ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-xl transform hover:scale-105'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6 mr-3" />
                    Donate Securely
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Secured by Razorpay • SSL Encrypted</span>
              </div>

              {/* Quick Impact Preview for Mobile */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Your Impact
                </h4>
                <div className="text-sm text-gray-700">
                  <p>• Your donation helps us rescue and feed street animals.</p>
                </div>
              </div>
            </div>

            {/* About This Campaign Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Campaign</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  GullyStrayCare is dedicated to rescuing, rehabilitating, and rehoming street animals across India.
                </p>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 mb-6 border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3">How Your Donation Helps:</h3>
                  <ul className="text-orange-800 space-y-2">
                    <li>• ₹25 - Feeds 1 street dog for a day</li>
                    <li>• ₹100 - Feeds 5 street dogs for a day</li>
                    <li>• ₹500 - Sterilization surgery for one animal</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Our Impact So Far</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {impactStats.map((stat, index) => (
                  <div key={index} className={`${stat.bg} rounded-xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow`}>
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.num}+</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What People Say</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-r-xl">
                    <div className="flex items-start space-x-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <Quote className="h-4 w-4 text-gray-400 mb-1" />
                        <p className="text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">Emergency Helpline</div>
                    <div className="text-orange-600">+91 9323263322</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-orange-600">gullystrayc@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 hidden lg:block border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>

              {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Donation Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Donation Frequency</label>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'monthly'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setDonationType('onetime')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${donationType === 'onetime'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    One-Time
                  </button>
                </div>
              </div>

              {/* Select Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[25, 50, 100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`p-3 rounded-xl border-2 font-semibold transition-all duration-200 ${selectedAmount === amt && !customAmount
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Your Information */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Information</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taxExemption}
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Claim 80G Tax Exemption</span>
                    <p className="text-sm text-gray-600 mt-1">Get tax benefits up to 50% under Section 80G</p>
                  </div>
                </label>

                {taxExemption && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="PAN Number *"
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Aadhaar Number *"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <textarea
                      rows={3}
                      placeholder="Complete Address with Pincode *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Donate Now Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex justify-center items-center transition-all duration-300 shadow-lg ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-xl transform hover:scale-105'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Donate Securely
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Secured by Razorpay • SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section - At the bottom */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Camera className="h-7 w-7 mr-3 text-orange-600" />
                  Our Journey in Pictures
                </h2>
                <p className="text-gray-600 mt-2">Witness the impact of your donations through our rescue stories</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">2,847+</div>
                <div className="text-sm text-gray-600">Lives Transformed</div>
              </div>
            </div>
          </div>

          {/* Gallery Grid - Clean images without text overlays */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={image}
                      alt={`Rescue story ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Simple hover overlay without text */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Play button for some images (simulating videos) */}
                    {index % 4 === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                View More Stories
              </button>
            </div>
          </div>

          {/* Gallery Stats */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">2,847</div>
                <div className="text-orange-100 text-sm">Photos & Videos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">550+</div>
                <div className="text-orange-100 text-sm">Rescue Stories</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">12</div>
                <div className="text-orange-100 text-sm">Cities Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-orange-100 text-sm">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;