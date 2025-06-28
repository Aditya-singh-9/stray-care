import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Award, Heart, Users, TrendingUp, MapPin, ArrowRight, CheckCircle, Camera, Play, Phone, Mail, Clock, Globe } from 'lucide-react';

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

  const predefinedAmounts = [25, 50, 100, 200, 500, 1000];

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [taxExemption, setTaxExemption] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // ✅ CREATE RAZORPAY ORDER VIA EDGE FUNCTION
  const createRazorpayOrder = async (amount: number) => {
    try {
      console.log('🚀 Creating Razorpay order for amount:', amount);
      
      const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            donor_name: donorInfo.name,
            donor_email: donorInfo.email,
            donor_phone: donorInfo.phone,
            tax_exemption: taxExemption.toString(),
            pan: pan || 'Not provided',
            aadhaar: aadhaar || 'Not provided',
            address: address || 'Not provided'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('✅ Order created successfully:', data.order);
      return data.order;
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  };

  // ✅ VERIFY PAYMENT VIA EDGE FUNCTION
  const verifyPayment = async (paymentData: any) => {
    try {
      console.log('🔍 Verifying payment...');
      
      const response = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.success && data.verified) {
        console.log('✅ Payment verified successfully');
        return true;
      } else {
        console.log('❌ Payment verification failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      return false;
    }
  };

  // ✅ ENHANCED PAYMENT HANDLER WITH ORDERS API
  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      alert('Payment gateway not loaded yet. Please try again in a moment.');
      return;
    }

    if (!validateFields()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const amount = customAmount ? parseInt(customAmount) : selectedAmount;
      
      // ✅ Step 1: Create Razorpay Order
      console.log('🚀 Step 1: Creating Razorpay order...');
      const order = await createRazorpayOrder(amount);
      
      // ✅ Step 2: Open Razorpay Checkout with Order ID
      console.log('🚀 Step 2: Opening Razorpay checkout with order ID:', order.id);
      
      const options = {
        key: 'rzp_live_CVLoRP0AMxJhjw', // Your Razorpay Key ID
        
        // ✅ Use the order details from API
        order_id: order.id, // This is the key for auto-capture!
        amount: order.amount,
        currency: order.currency,
        
        name: 'GullyStray Care',
        description: 'Donation for Animal Welfare - Thank you for your kindness!',
        image: Logo,
        
        // ✅ Success handler with verification
        handler: async function (response: any) {
          console.log('✅ Payment Success Response:', response);
          
          try {
            // ✅ Step 3: Verify payment signature
            console.log('🔍 Step 3: Verifying payment...');
            const isVerified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (isVerified) {
              // ✅ Payment verified - navigate to thank you page
              setIsProcessing(false);
              navigate('/thank-you', {
                state: {
                  name: donorInfo.name,
                  amount: amount,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  timestamp: new Date().toISOString()
                },
              });
            } else {
              throw new Error('Payment verification failed');
            }
            
          } catch (verificationError) {
            console.error('❌ Payment verification error:', verificationError);
            setIsProcessing(false);
            setError('Payment verification failed. Please contact support.');
          }
        },
        
        // ✅ Prefill customer details
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone,
        },
        
        // ✅ Theme customization
        theme: { 
          color: '#F37254',
          backdrop_color: 'rgba(0,0,0,0.5)'
        },
        
        // ✅ Payment methods configuration
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: false,
          paylater: false
        },
        
        // ✅ Modal configuration
        modal: {
          escape: true,
          confirm_close: true,
          ondismiss: () => {
            console.log('❌ Payment cancelled by user');
            setIsProcessing(false);
          },
          animation: true,
          backdrop_close: false
        },
        
        // ✅ Retry configuration
        retry: {
          enabled: true,
          max_count: 3
        },
        
        // ✅ Timeout configuration (5 minutes)
        timeout: 300,
        
        // ✅ Remember customer preference
        remember_customer: false,
        
        // ✅ Send SMS/Email notifications
        send_sms_hash: true,
        allow_rotation: true,
        
        // ✅ Readonly contact details
        readonly: {
          email: false,
          contact: false,
          name: false
        }
      };

      // ✅ Initialize Razorpay with enhanced error handling
      const rzp = new window.Razorpay(options);
      
      // ✅ Payment failure handler
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment Failed:', response.error);
        setIsProcessing(false);
        
        let errorMessage = 'Payment failed. Please try again.';
        
        // ✅ Specific error messages
        switch (response.error.code) {
          case 'BAD_REQUEST_ERROR':
            errorMessage = 'Invalid payment details. Please check your information and try again.';
            break;
          case 'GATEWAY_ERROR':
            errorMessage = 'Payment gateway error. Please try a different payment method.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'SERVER_ERROR':
            errorMessage = 'Server error. Please try again in a few minutes.';
            break;
          case 'VALIDATION_ERROR':
            errorMessage = 'Validation error. Please check your payment details.';
            break;
          default:
            errorMessage = `Payment failed: ${response.error.description || 'Unknown error'}`;
        }
        
        setError(errorMessage);
        
        // ✅ Detailed error logging
        console.log('💥 Payment Error Details:', {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          payment_id: response.error.metadata?.payment_id
        });
      });

      // ✅ Open Razorpay Checkout
      console.log('🚀 Opening Razorpay checkout...');
      rzp.open();
      
    } catch (orderError) {
      console.error('❌ Error in payment process:', orderError);
      setIsProcessing(false);
      setError('Failed to initiate payment. Please try again.');
    }
  };

  const impactStats = [
    { icon: Heart, num: 550, label: 'Animals Rescued', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Users, num: 223, label: 'Successful Adoptions', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, num: 545, label: 'Sterilizations Done', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: MapPin, num: 12, label: 'Cities Covered', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const memoryImages = [
    { src: PersonalImage1, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage2, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage3, type: "video", location: "Mumbai, Maharashtra" },
    { src: PersonalImage4, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage1, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage2, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage3, type: "video", location: "Mumbai, Maharashtra" },
    { src: PersonalImage4, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage1, type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage2, type: "video", location: "Mumbai, Maharashtra" },
  ];

  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Veterinary Partner", quote: "Working with GullyStrayCare has been incredibly rewarding. Their dedication is unmatched." },
    { name: "Rajesh Kumar", role: "Monthly Donor", quote: "The transparency and impact reports give me confidence in supporting this cause." },
    { name: "Meera Singh", role: "Volunteer", quote: "Being part of rescue operations has been the most fulfilling experience of my life." },
  ];

  const quickFacts = [
    { label: "Response Time", value: "< 2 Hours", icon: Clock },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Volunteer Network", value: "500+", icon: Users },
    { label: "Partner Clinics", value: "25+", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-blue-100">
      {/* HEADER - Always visible */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <img src={Logo} alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 sm:border-3 border-amber-400 shadow-lg" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">GullyStrayCare</h1>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold">Compassion in Action</p>
            </div>
          </div>
          
          {/* Mobile Gallery Toggle */}
          <button 
            onClick={() => setShowGallery(!showGallery)}
            className="lg:hidden bg-gradient-to-r from-blue-600 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Gallery
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {['Home', 'About', 'Services', 'Impact', 'Contact'].map((item) => (
              <a key={item} href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 relative group px-3 py-2">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Gallery Overlay */}
      {showGallery && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/90 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Camera className="h-6 w-6 mr-3 text-amber-400" />
                Our Journey
              </h3>
              <button 
                onClick={() => setShowGallery(false)}
                className="text-white bg-white/20 px-4 py-2 rounded-full"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memoryImages.slice(0, 6).map((memory, index) => (
                <div key={index} className="relative overflow-hidden rounded-2xl">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={memory.src} 
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-amber-500/80 backdrop-blur-sm rounded-full p-4">
                          <Play className="h-6 w-6 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="mb-2">
                        <span className="bg-amber-500 px-2 py-1 rounded-full text-xs font-bold uppercase">
                          {memory.type}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-300 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{memory.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex min-h-screen">
        {/* LEFT SIDE - Payment Form */}
        <div className="w-full lg:w-[70%] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Hero Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-amber-100 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-blue-800 font-semibold mb-4 sm:mb-6 shadow-md">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-amber-600" />
                Transform Lives Today
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Support Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">Mission</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Every donation helps us rescue, rehabilitate, and rehome street animals across India. Join thousands of compassionate donors making a real difference.
              </p>
            </div>

            {/* Quick Facts Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {quickFacts.map((fact, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center shadow-md border border-amber-200 hover:shadow-lg transition-all duration-300">
                  <fact.icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{fact.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{fact.label}</div>
                </div>
              ))}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-amber-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                <Lock className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
                Secure Donation Portal
              </h2>
              
              {error && (
                <div className="p-4 mb-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center">
                  <Shield className="h-5 w-5 mr-3" />
                  {error}
                </div>
              )}

              {/* Amount Selection */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Impact Amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-3 font-bold transition-all duration-300 transform hover:scale-105 ${
                        selectedAmount === amt && !customAmount
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-amber-50 text-blue-700 shadow-xl'
                          : 'border-amber-200 hover:border-blue-300 hover:shadow-lg bg-gradient-to-r from-gray-50 to-blue-50'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">₹{amt}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {amt === 25 && "Feeds 5 dogs"}
                        {amt === 50 && "Medical care"}
                        {amt === 100 && "Emergency rescue"}
                        {amt === 200 && "Surgery fund"}
                        {amt === 500 && "Rehabilitation"}
                        {amt === 1000 && "Mobile clinic"}
                      </div>
                      {selectedAmount === amt && !customAmount && (
                        <CheckCircle className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 h-6 w-6 sm:h-8 sm:w-8 text-blue-500 bg-white rounded-full shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter your custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-4 sm:p-6 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-lg sm:text-xl transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50"
                  />
                  <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-base sm:text-lg">₹</div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Your Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  className="w-full p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                />
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl sm:rounded-2xl border-2 border-amber-300">
                <label className="flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={taxExemption} 
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rounded-lg focus:ring-blue-500 mt-1 sm:mt-0"
                  />
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">Claim 80G Tax Exemption</span>
                    <p className="text-gray-600 mt-1">Save up to 30% on taxes with our 80G certificate</p>
                  </div>
                </label>
                
                {taxExemption && (
                  <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 animate-fadeIn">
                    <input 
                      type="text" 
                      placeholder="PAN Number *" 
                      value={pan} 
                      onChange={(e) => setPan(e.target.value)} 
                      className="w-full p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg" 
                    />
                    <input 
                      type="text" 
                      placeholder="Aadhaar Number *" 
                      value={aadhaar} 
                      onChange={(e) => setAadhaar(e.target.value)} 
                      className="w-full p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg" 
                    />
                    <textarea 
                      rows={4} 
                      placeholder="Complete Address with Pincode *" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="w-full p-4 sm:p-5 border-2 sm:border-3 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-base sm:text-lg" 
                    />
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl flex justify-center items-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-7 sm:w-7 border-b-2 border-white mr-3 sm:mr-4"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 sm:h-7 sm:w-7 mr-3 sm:mr-4" /> 
                    Donate ₹{customAmount || selectedAmount} Securely
                    <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7 ml-3 sm:ml-4" />
                  </>
                )}
              </button>

              <div className="mt-4 sm:mt-6 flex justify-center items-center text-gray-600 text-sm sm:text-base">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-green-500" />
                <span className="font-semibold text-center">256-bit SSL Encrypted • PCI DSS Compliant • Trusted by 15,000+ donors</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className={`${stat.bg} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-200`}>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${stat.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.num}+</div>
                  <div className="text-gray-600 font-semibold text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">What Our Community Says</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/30 transition-all duration-300">
                    <p className="text-white/90 mb-3 sm:mb-4 italic text-sm sm:text-base">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-bold text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-white/80 text-xs sm:text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-amber-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
                Need Help? Contact Us
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">Emergency Helpline</div>
                      <div className="text-blue-600 font-semibold text-sm sm:text-base">+91 9323263322</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">Email Support</div>
                      <div className="text-blue-600 font-semibold text-sm sm:text-base">gullystrayc@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">Support Hours</div>
                      <div className="text-gray-600 text-sm sm:text-base">9:00 AM - 9:00 PM Daily</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">Coverage Area</div>
                      <div className="text-gray-600 text-sm sm:text-base">12+ Cities Across India</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Memories Gallery (Desktop Only) */}
        <div className="hidden lg:block w-[30%] bg-gradient-to-b from-blue-900 via-blue-800 to-amber-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
          
          {/* Header */}
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold flex items-center">
                  <Camera className="h-8 w-8 mr-4 text-amber-400" />
                  Our Journey
                </h3>
                <p className="text-blue-200 mt-2 text-lg">Stories of hope and transformation</p>
              </div>
              <button className="text-amber-400 hover:text-amber-300 transition-colors bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">View All</span>
              </button>
            </div>
          </div>

          {/* Scrollable Gallery */}
          <div className="relative z-10 h-full overflow-y-auto pb-32 px-6">
            <div className="space-y-8">
              {memoryImages.map((memory, index) => (
                <div key={index} className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={memory.src} 
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Play button for videos */}
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-amber-500/80 backdrop-blur-sm rounded-full p-6 group-hover:bg-amber-400/90 transition-all duration-300 shadow-2xl">
                          <Play className="h-10 w-10 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    {/* Location overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="mb-3">
                        <span className="bg-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          {memory.type}
                        </span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center text-amber-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{memory.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load more button */}
            <div className="mt-12 text-center">
              <button className="bg-gradient-to-r from-amber-500 to-blue-600 text-white px-8 py-4 rounded-full hover:from-amber-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-xl">
                Load More Stories
              </button>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <div className="bg-gradient-to-r from-blue-600/90 to-amber-600/90 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-300">2,847</div>
                  <div className="text-sm text-blue-200">Memories Captured</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-300">24/7</div>
                  <div className="text-sm text-blue-200">Always Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;