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
    { icon: Heart, num: 550, label: 'Animals Rescued', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Users, num: 223, label: 'Successful Adoptions', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, num: 545, label: 'Sterilizations Done', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: MapPin, num: 12, label: 'Cities Covered', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const memoryImages = [
    { src: PersonalImage1, title: "Emergency Rescue Operation", subtitle: "Life-saving mission in Mumbai streets", type: "photo", location: "Mumbai, Maharashtra" },
    { src: PersonalImage2, title: "Medical Treatment Success", subtitle: "Complex surgery saves Bruno's life", type: "photo", location: "Delhi Veterinary Hospital" },
    { src: PersonalImage3, title: "Happy Adoption Day", subtitle: "Max finds his forever family", type: "video", location: "Bangalore Adoption Center" },
    { src: PersonalImage4, title: "Community Awareness Drive", subtitle: "Educating local communities", type: "photo", location: "Pune Community Center" },
    { src: PersonalImage1, title: "Daily Feeding Program", subtitle: "Nutritious meals for street animals", type: "photo", location: "Kolkata Feeding Station" },
    { src: PersonalImage2, title: "Vaccination Campaign", subtitle: "Preventive healthcare initiative", type: "photo", location: "Chennai Mobile Clinic" },
    { src: PersonalImage3, title: "Volunteer Training Session", subtitle: "Building our rescue team", type: "video", location: "Training Center" },
    { src: PersonalImage4, title: "Rehabilitation Success", subtitle: "From injury to full recovery", type: "photo", location: "Recovery Facility" },
    { src: PersonalImage1, title: "Sterilization Drive", subtitle: "Population control program", type: "photo", location: "Mobile Clinic" },
    { src: PersonalImage2, title: "Emergency Night Rescue", subtitle: "24/7 rescue operations", type: "video", location: "Highway Rescue" },
  ];

  const impactItems = [
    { amount: "₹100", impact: "Feeds 5 street dogs nutritious meals", icon: Heart, color: "text-amber-600", bg: "bg-amber-50" },
    { amount: "₹500", impact: "Complete vaccination & health checkup", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
    { amount: "₹1000", impact: "Emergency rescue & first aid treatment", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { amount: "₹2500", impact: "Life-saving surgical procedures", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
    { amount: "₹5000", impact: "Complete rehabilitation program", icon: Heart, color: "text-amber-600", bg: "bg-amber-50" },
    { amount: "₹10000", impact: "Mobile clinic operations for a week", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
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
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={Logo} alt="Logo" className="h-16 w-16 rounded-full border-3 border-amber-400 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">GullyStrayCare</h1>
              <p className="text-sm text-blue-600 font-semibold">Compassion in Action</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Impact', 'Contact'].map((item) => (
              <a key={item} href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 relative group px-3 py-2">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-amber-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
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
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-amber-100 px-8 py-4 rounded-full text-blue-800 font-semibold mb-6 shadow-md">
                <Heart className="h-6 w-6 mr-3 text-amber-600" />
                Transform Lives Today
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Support Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">Mission</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Every donation helps us rescue, rehabilitate, and rehome street animals across India. Join thousands of compassionate donors making a real difference.
              </p>
            </div>

            {/* Quick Facts Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {quickFacts.map((fact, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 text-center shadow-md border border-amber-200 hover:shadow-lg transition-all duration-300">
                  <fact.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{fact.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{fact.label}</div>
                </div>
              ))}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-amber-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Lock className="h-8 w-8 mr-4 text-blue-600" />
                Secure Donation Portal
              </h2>
              
              {error && (
                <div className="p-4 mb-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center">
                  <Shield className="h-5 w-5 mr-3" />
                  {error}
                </div>
              )}

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-xl font-bold text-gray-900 mb-6">Choose Your Impact Amount</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`relative p-6 rounded-2xl border-3 font-bold transition-all duration-300 transform hover:scale-105 ${
                        selectedAmount === amt && !customAmount
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-amber-50 text-blue-700 shadow-xl'
                          : 'border-amber-200 hover:border-blue-300 hover:shadow-lg bg-gradient-to-r from-gray-50 to-blue-50'
                      }`}
                    >
                      <div className="text-3xl font-bold mb-2">₹{amt}</div>
                      <div className="text-sm text-gray-600">
                        {amt === 100 && "Feeds 5 dogs"}
                        {amt === 500 && "Medical care"}
                        {amt === 1000 && "Emergency rescue"}
                        {amt === 2500 && "Surgery fund"}
                        {amt === 5000 && "Rehabilitation"}
                        {amt === 10000 && "Mobile clinic"}
                      </div>
                      {selectedAmount === amt && !customAmount && (
                        <CheckCircle className="absolute -top-3 -right-3 h-8 w-8 text-blue-500 bg-white rounded-full shadow-lg" />
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
                    className="w-full p-6 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-xl transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50"
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">INR</div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="mb-8">
                <label className="block text-xl font-bold text-gray-900 mb-6">Your Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  className="w-full p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                />
              </div>

              {/* 80G Tax Exemption */}
              <div className="mb-8 p-8 bg-gradient-to-r from-amber-50 to-blue-50 rounded-2xl border-2 border-amber-300">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={taxExemption} 
                    onChange={(e) => setTaxExemption(e.target.checked)}
                    className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xl font-bold text-gray-900">Claim 80G Tax Exemption</span>
                    <p className="text-gray-600 mt-1">Save up to 30% on taxes with our 80G certificate</p>
                  </div>
                </label>
                
                {taxExemption && (
                  <div className="mt-8 space-y-6 animate-fadeIn">
                    <input 
                      type="text" 
                      placeholder="PAN Number *" 
                      value={pan} 
                      onChange={(e) => setPan(e.target.value)} 
                      className="w-full p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg" 
                    />
                    <input 
                      type="text" 
                      placeholder="Aadhaar Number *" 
                      value={aadhaar} 
                      onChange={(e) => setAadhaar(e.target.value)} 
                      className="w-full p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg" 
                    />
                    <textarea 
                      rows={4} 
                      placeholder="Complete Address with Pincode *" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="w-full p-5 border-3 border-amber-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-lg" 
                    />
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-amber-600 hover:from-blue-700 hover:via-blue-800 hover:to-amber-700 text-white py-6 rounded-2xl font-bold text-xl flex justify-center items-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Lock className="h-7 w-7 mr-4" /> 
                Donate ₹{customAmount || selectedAmount} Securely
                <ArrowRight className="h-7 w-7 ml-4" />
              </button>

              <div className="mt-6 flex justify-center items-center text-gray-600">
                <Shield className="h-6 w-6 mr-3 text-green-500" />
                <span className="font-semibold">256-bit SSL Encrypted • PCI DSS Compliant • Trusted by 15,000+ donors</span>
              </div>
            </div>

            {/* Impact Grid */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-amber-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Award className="h-8 w-8 mr-4 text-amber-600" />
                Your Donation Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {impactItems.map((item, index) => (
                  <div key={index} className={`flex items-center p-6 ${item.bg} rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-amber-200`}>
                    <div className="flex-shrink-0 mr-6">
                      <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 border-amber-300`}>
                        <item.icon className={`h-8 w-8 ${item.color}`} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-2xl text-gray-900 mb-1">{item.amount}</div>
                      <div className="text-gray-700 font-medium">{item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className={`${stat.bg} rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-200`}>
                  <div className="flex justify-center mb-4">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.num}+</div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-3xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-8 text-center">What Our Community Says</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 transition-all duration-300">
                    <p className="text-white/90 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-white/80 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-amber-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Phone className="h-8 w-8 mr-4 text-blue-600" />
                Need Help? Contact Us
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900">Emergency Helpline</div>
                      <div className="text-blue-600 font-semibold">+91 9323263322</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900">Email Support</div>
                      <div className="text-blue-600 font-semibold">gullystrayc@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900">Support Hours</div>
                      <div className="text-gray-600">9:00 AM - 9:00 PM Daily</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 mr-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-gray-900">Coverage Area</div>
                      <div className="text-gray-600">12+ Cities Across India</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Memories Gallery (30%) */}
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
                      alt={memory.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    
                    {/* Play button for videos */}
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-amber-500/80 backdrop-blur-sm rounded-full p-6 group-hover:bg-amber-400/90 transition-all duration-300 shadow-2xl">
                          <Play className="h-10 w-10 text-white fill-current" />
                        </div>
                      </div>
                    )}
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="mb-3">
                        <span className="bg-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          {memory.type}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">{memory.title}</h4>
                      <p className="text-blue-200 opacity-90 mb-3 leading-relaxed">{memory.subtitle}</p>
                      
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