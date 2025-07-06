import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Award, Heart, Users, TrendingUp, MapPin, ArrowRight, CheckCircle, Phone, Mail, Clock, Globe, Star, Quote, Camera, Play } from 'lucide-react';

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

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
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
      const options = {
        key: 'rzp_live_CVLoRP0AMxJhjw',
        amount: amount * 100,
        currency: 'INR',
        name: 'GullyStray Care',
        description: 'Donation for Animal Welfare',
        image: Logo,
        
        handler: function (response: any) {
          console.log('Payment Success:', response);
          navigate('/thank-you', {
            state: {
              name: donorInfo.name,
              amount: amount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || 'N/A',
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
          donor_name: donorInfo.name,
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone,
          tax_exemption: taxExemption,
          pan: pan || '',
          aadhaar: aadhaar || '',
          address: address || ''
        },
        
        theme: { 
          color: '#F37254' 
        },
        
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
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

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment Failed:', response.error);
        setIsProcessing(false);
        
        let errorMessage = 'Payment failed. Please try again.';
        
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMessage = 'Invalid payment details. Please check and try again.';
        } else if (response.error.code === 'GATEWAY_ERROR') {
          errorMessage = 'Payment gateway error. Please try a different payment method.';
        } else if (response.error.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        setError(errorMessage);
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

  // Gallery images with descriptions
  const galleryImages = [
    {
      src: PersonalImage1,
      title: "Emergency Rescue Operation",
      description: "Our team responding to an emergency call in Mumbai",
      category: "Rescue",
      location: "Mumbai, Maharashtra"
    },
    {
      src: PersonalImage2,
      title: "Medical Treatment",
      description: "Providing essential medical care to injured animals",
      category: "Medical",
      location: "Delhi, NCR"
    },
    {
      src: PersonalImage3,
      title: "Successful Recovery",
      description: "A rescued dog recovering after surgery",
      category: "Recovery",
      location: "Bangalore, Karnataka"
    },
    {
      src: PersonalImage4,
      title: "Happy Adoption",
      description: "A beautiful moment when pets find their forever homes",
      category: "Adoption",
      location: "Pune, Maharashtra"
    },
    {
      src: HeroImg,
      title: "Community Outreach",
      description: "Educating communities about animal welfare",
      category: "Education",
      location: "Chennai, Tamil Nadu"
    },
    {
      src: AboutImg,
      title: "Volunteer Training",
      description: "Training volunteers for rescue operations",
      category: "Training",
      location: "Hyderabad, Telangana"
    },
    {
      src: ImpactImg,
      title: "Sterilization Drive",
      description: "Mass sterilization program to control population",
      category: "Sterilization",
      location: "Kolkata, West Bengal"
    },
    {
      src: PersonalImage1,
      title: "Feeding Program",
      description: "Daily feeding of street animals in urban areas",
      category: "Feeding",
      location: "Ahmedabad, Gujarat"
    },
    {
      src: PersonalImage2,
      title: "Shelter Care",
      description: "Providing temporary shelter for rescued animals",
      category: "Shelter",
      location: "Jaipur, Rajasthan"
    },
    {
      src: PersonalImage3,
      title: "Vaccination Drive",
      description: "Preventive healthcare through vaccination programs",
      category: "Healthcare",
      location: "Lucknow, Uttar Pradesh"
    },
    {
      src: PersonalImage4,
      title: "Rehabilitation Success",
      description: "Animals fully recovered and ready for adoption",
      category: "Success",
      location: "Bhopal, Madhya Pradesh"
    },
    {
      src: HeroImg,
      title: "Emergency Response",
      description: "24/7 emergency response team in action",
      category: "Emergency",
      location: "Gurgaon, Haryana"
    }
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
          
          {/* Left Column - Campaign Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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

            {/* Campaign Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Campaign</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  GullyStrayCare is dedicated to rescuing, rehabilitating, and rehoming street animals across India. 
                  Since our inception during the COVID-19 pandemic, we have been working tirelessly to provide food, 
                  medical care, and shelter to animals in need.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your donation directly supports our emergency rescue operations, medical treatments, sterilization 
                  programs, and adoption services. Every contribution, no matter the size, makes a real difference 
                  in an animal's life.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">How Your Donation Helps:</h3>
                  <ul className="text-blue-800 space-y-1">
                    <li>• ₹100 - Feeds 5 street dogs for a day</li>
                    <li>• ₹500 - Provides basic medical care and vaccination</li>
                    <li>• ₹1000 - Covers sterilization surgery for one animal</li>
                    <li>• ₹2500 - Emergency surgery and rehabilitation</li>
                    <li>• ₹5000 - Complete rescue and adoption process</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Our Impact So Far</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {impactStats.map((stat, index) => (
                  <div key={index} className={`${stat.bg} rounded-lg p-4 text-center`}>
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.num}+</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What People Say</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Emergency Helpline</div>
                    <div className="text-blue-600">+91 9323263322</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-blue-600">gullystrayc@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Support Hours</div>
                    <div className="text-gray-600">9:00 AM - 9:00 PM Daily</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Coverage</div>
                    <div className="text-gray-600">12+ Cities Across India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
              
              {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`p-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                        selectedAmount === amt && !customAmount
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Donor Information */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Information</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={taxExemption} 
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      type="text" 
                      placeholder="Aadhaar Number *" 
                      value={aadhaar} 
                      onChange={(e) => setAadhaar(e.target.value)} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <textarea 
                      rows={3} 
                      placeholder="Complete Address with Pincode *" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                    />
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex justify-center items-center transition-all duration-300 ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-3" /> 
                    Donate ₹{(customAmount || selectedAmount).toLocaleString()} Securely
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Secured by Razorpay • SSL Encrypted</span>
              </div>

              {/* Tax Benefits Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Tax Benefits Available</span>
                </div>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 80G Tax Certificate provided</li>
                  <li>• Save up to 50% on taxes</li>
                  <li>• Instant receipt via email</li>
                  <li>• Valid for IT returns</li>
                </ul>
              </div>

              {/* Quick Impact */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Your Impact</h4>
                <div className="text-sm text-blue-800">
                  {customAmount || selectedAmount >= 5000 && (
                    <p>• Complete rescue & adoption process for 1 animal</p>
                  )}
                  {(customAmount || selectedAmount) >= 2500 && (customAmount || selectedAmount) < 5000 && (
                    <p>• Emergency surgery & rehabilitation for 1 animal</p>
                  )}
                  {(customAmount || selectedAmount) >= 1000 && (customAmount || selectedAmount) < 2500 && (
                    <p>• Sterilization surgery for 1 animal</p>
                  )}
                  {(customAmount || selectedAmount) >= 500 && (customAmount || selectedAmount) < 1000 && (
                    <p>• Medical care & vaccination for 1 animal</p>
                  )}
                  {(customAmount || selectedAmount) < 500 && (
                    <p>• Feeds {Math.floor((customAmount || selectedAmount) / 20)} street dogs</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section - At the bottom */}
        <div className="mt-16 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Camera className="h-7 w-7 mr-3 text-blue-600" />
                  Our Journey in Pictures
                </h2>
                <p className="text-gray-600 mt-2">Witness the impact of your donations through our rescue stories</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">2,847+</div>
                <div className="text-sm text-gray-600">Lives Transformed</div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={image.src} 
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {image.category}
                      </span>
                    </div>

                    {/* Play button for some images (simulating videos) */}
                    {index % 4 === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm opacity-90 mb-2">{image.description}</p>
                      <div className="flex items-center text-xs opacity-75">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{image.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                View More Stories
              </button>
            </div>
          </div>

          {/* Gallery Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">2,847</div>
                <div className="text-blue-100 text-sm">Photos & Videos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">550+</div>
                <div className="text-blue-100 text-sm">Rescue Stories</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">12</div>
                <div className="text-blue-100 text-sm">Cities Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-blue-100 text-sm">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;