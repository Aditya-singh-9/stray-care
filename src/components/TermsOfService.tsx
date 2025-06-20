import React from 'react';
import { FileText, CreditCard, RefreshCw, AlertTriangle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo-1.jpg';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
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
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-2 rounded-full hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-amber-100 px-6 py-3 rounded-full text-amber-800 font-semibold mb-6">
              <FileText className="h-5 w-5 mr-2" />
              Terms of Service
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services or making donations to GullyStrayCare.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing our website, making donations, or using our services, you agree to be bound by these Terms of Service. 
                  If you do not agree with any part of these terms, please do not use our services.
                </p>
                <p>
                  GullyStrayCare reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                </p>
              </div>
            </section>

            {/* About Our Organization */}
            <section className="border-l-4 border-amber-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. About GullyStrayCare</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  GullyStrayCare is a registered non-profit organization dedicated to the rescue, rehabilitation, and rehoming of street animals across India. 
                  We operate under the guidelines of animal welfare laws and maintain transparency in all our operations.
                </p>
                <p>
                  Our services include emergency rescue, medical treatment, sterilization programs, adoption services, and community education.
                </p>
              </div>
            </section>

            {/* Donations and Payments */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Donations and Payments</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Donation Policy:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>All donations are voluntary and made with the intent to support animal welfare</li>
                  <li>Donations are processed securely through Razorpay payment gateway</li>
                  <li>We accept donations via credit/debit cards, UPI, net banking, and digital wallets</li>
                  <li>Minimum donation amount is ₹25</li>
                  <li>All amounts are in Indian Rupees (INR)</li>
                </ul>
                
                <p><strong>Tax Benefits:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Donations are eligible for 80G tax exemption under Income Tax Act</li>
                  <li>Tax certificates will be issued within 30 days of donation</li>
                  <li>Valid PAN, Aadhaar, and address details are required for tax certificates</li>
                </ul>
              </div>
            </section>

            {/* Refund and Cancellation Policy */}
            <section className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center mb-4">
                <RefreshCw className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Refund and Cancellation Policy</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>General Policy:</strong></p>
                <p>
                  As donations are made voluntarily to support animal welfare, we generally do not provide refunds. 
                  However, we understand that exceptional circumstances may arise.
                </p>
                
                <p><strong>Refund Eligibility:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Technical errors resulting in duplicate payments</li>
                  <li>Unauthorized transactions (subject to verification)</li>
                  <li>Payment processing errors by our payment gateway</li>
                </ul>
                
                <p><strong>Refund Process:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Refund requests must be made within 7 days of the transaction</li>
                  <li>Contact us at gullystrayc@gmail.com with transaction details</li>
                  <li>Refunds will be processed within 7-10 business days after approval</li>
                  <li>Refunds will be credited to the original payment method</li>
                  <li>Processing fees (if any) may be deducted from the refund amount</li>
                </ul>
                
                <p><strong>Non-Refundable Situations:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Change of mind after successful donation</li>
                  <li>Donations made more than 7 days ago</li>
                  <li>Donations where tax certificates have been issued</li>
                  <li>Donations used for immediate animal rescue operations</li>
                </ul>
              </div>
            </section>

            {/* Use of Services */}
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Use of Services</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Permitted Use:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Making donations to support animal welfare</li>
                  <li>Accessing information about our services and impact</li>
                  <li>Contacting us for legitimate inquiries</li>
                  <li>Sharing our content for awareness purposes</li>
                </ul>
                
                <p><strong>Prohibited Activities:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Using false information for donations or tax certificates</li>
                  <li>Attempting to hack or disrupt our website</li>
                  <li>Using our services for illegal activities</li>
                  <li>Misrepresenting our organization or services</li>
                </ul>
              </div>
            </section>

            {/* Liability and Disclaimers */}
            <section className="border-l-4 border-orange-500 pl-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">6. Liability and Disclaimers</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  While we strive to provide accurate information and reliable services, GullyStrayCare makes no warranties 
                  regarding the completeness, accuracy, or availability of our website or services.
                </p>
                <p>
                  We are not liable for any indirect, incidental, or consequential damages arising from the use of our services. 
                  Our liability is limited to the amount of your donation.
                </p>
                <p>
                  We reserve the right to suspend or terminate services at any time without prior notice.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, refund requests, or any other inquiries:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">gullystrayc@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">+91 9323263322</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                <strong>Address:</strong> G-2, Ground Floor, G Wing, KK Residency, Life Care Medical, 
                Azad Nagar, Hill No. 4, Ghatkopar West, Mumbai - 400086
              </p>
            </section>

            {/* Governing Law */}
            <section className="text-center bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">8. Governing Law</h2>
              <p className="text-gray-600">
                These Terms of Service are governed by the laws of India. Any disputes will be subject to the 
                exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;