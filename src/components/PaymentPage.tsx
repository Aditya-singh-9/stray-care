import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Award, Heart, Users, TrendingUp, MapPin } from 'lucide-react';
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

interface RazorpayResponse {
  razorpay_payment_id: string;
}

const predefinedAmounts = [25, 50, 100, 500, 1000, 5000];

const PaymentPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [taxExemption, setTaxExemption] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const validateFields = (): boolean => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!donorInfo.name || !donorInfo.email || !donorInfo.phone || isNaN(amount) || amount <= 0) {
      setError("Please fill all required fields and enter a valid amount.");
      return false;
    }

    if (!emailRegex.test(donorInfo.email)) {
      setError("Invalid email address.");
      return false;
    }

    if (!phoneRegex.test(donorInfo.phone)) {
      setError("Invalid 10-digit phone number.");
      return false;
    }

    if (taxExemption && (!pan || !aadhaar || !address)) {
      setError("PAN, Aadhaar, and address are required for 80G exemption.");
      return false;
    }

    setError(null);
    return true;
  };

  const handlePayment = () => {
    if (!validateFields()) return;

    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    const options = {
      key: 'rzp_live_9ZPuTwlbYq5GZo',
      amount: amount * 100,
      currency: "INR",
      name: "GullyStray Care",
      description: "Thank you for your contribution",
      image: '/logo-1.jpg',
      handler: (response: RazorpayResponse) => {
        navigate('/thank-you', {
          state: {
            name: donorInfo.name,
            amount: customAmount || selectedAmount,
            paymentId: response.razorpay_payment_id,
          },
        });
      },
      prefill: donorInfo,
      notes: { donation_purpose: "Animal Rescue", pan, aadhaar, address },
      theme: { color: "#F37254" },
      method: { netbanking: true, card: true, upi: true, wallet: true }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-12 w-12 rounded-full border" />
            <div>
              <h1 className="font-bold text-xl">GullyStrayCare</h1>
              <p className="text-sm text-blue-600">Compassion in Action</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-gray-800">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="/" className="hover:text-blue-600 transition-colors">About</a>
            <a href="/" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="/" className="hover:text-blue-600 transition-colors">Impact</a>
            <a href="/" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-md border">
          <h2 className="text-2xl font-bold mb-6">Make a Secure Donation</h2>
          {error && <div className="p-3 mb-4 bg-red-100 border text-red-600 rounded">{error}</div>}

          <div className="mb-6">
            <label className="font-semibold block mb-2">Select Amount</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {predefinedAmounts.map((amt) => (
                <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`py-2 px-5 rounded-lg border font-semibold transition-all duration-200
                    ${selectedAmount === amt && !customAmount ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-yellow-300 hover:scale-105'}`}>
                  ₹{amt}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Custom Amount (₹)" value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300" />
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-2">Donor Information</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <input type="text" placeholder="Full Name *" value={donorInfo.name}
                onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                className="w-full p-3 border rounded-lg" />
              <input type="email" placeholder="Email *" value={donorInfo.email}
                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                className="w-full p-3 border rounded-lg" />
            </div>
            <input type="tel" placeholder="Phone *" value={donorInfo.phone}
              onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
              className="w-full p-3 border rounded-lg" />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={taxExemption} onChange={(e) => setTaxExemption(e.target.checked)} />
              Claim 80G Tax Exemption?
            </label>
            {taxExemption && (
              <div className="mt-4 space-y-3">
                <input type="text" placeholder="PAN Number *" value={pan}
                  onChange={(e) => setPan(e.target.value)} className="w-full p-3 border rounded-lg" />
                <input type="text" placeholder="Aadhaar Number *" value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)} className="w-full p-3 border rounded-lg" />
                <textarea rows={3} placeholder="Full Address *" value={address}
                  onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg" />
              </div>
            )}
          </div>

          <button onClick={handlePayment}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center shadow-lg">
            <Lock className="h-5 w-5 mr-2" /> Donate ₹{customAmount || selectedAmount}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 flex justify-center items-center">
            <Shield className="h-4 w-4 mr-2 text-green-500" /> SSL Encrypted • PCI DSS Compliant
          </p>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold flex items-center"><Award className="text-yellow-500 mr-2" /> Memories</h4>
              <span className="text-green-700 text-sm font-semibold cursor-pointer">VIEW ALL</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[PersonalImage1, PersonalImage2, PersonalImage3, PersonalImage4].map((img, idx) => (
                <img key={idx} src={img} alt={`Memory ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border hover:scale-105 transition-all duration-300" />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h4 className="font-bold mb-4 flex items-center"><Award className="text-yellow-500 mr-2" /> Your Impact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><span className="font-bold text-orange-500">₹100</span> Feeds 5 street dogs</div>
              <div className="flex items-center gap-3"><span className="font-bold text-green-500">₹500</span> Basic medical care</div>
              <div className="flex items-center gap-3"><span className="font-bold text-blue-500">₹2500</span> Emergency surgery</div>
            </div>
          </div>
        </aside>
      </main>

      <section className="bg-blue-600 text-white py-12 mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Our Impact</h2>
        <p className="text-center mb-10">Every number represents a life saved, a family completed, and a community made more compassionate</p>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-4">
          <ImpactBox icon={<Heart className="text-orange-500" />} num={550} label="Animals Rescued" />
          <ImpactBox icon={<Users className="text-green-500" />} num={223} label="Successful Adoptions" />
          <ImpactBox icon={<TrendingUp className="text-blue-500" />} num={545} label="Sterilizations Done" />
          <ImpactBox icon={<MapPin className="text-pink-400" />} num={12} label="Cities Covered" />
        </div>
      </section>
    </div>
  );
};

const ImpactBox = ({ icon, num, label }: { icon: JSX.Element, num: number, label: string }) => (
  <div className="bg-white rounded-xl text-center p-6 shadow-md text-black">
    <div className="flex justify-center text-4xl mb-4">{icon}</div>
    <h3 className="text-3xl font-bold">{num}</h3>
    <p className="mt-2">{label}</p>
  </div>
);

export default PaymentPage;
