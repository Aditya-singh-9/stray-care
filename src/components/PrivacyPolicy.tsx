import React from 'react';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo-1.jpg';

const PrivacyPolicy: React.FC = () => {
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
            <div className="inline-flex items-center bg-blue-100 px-6 py-3 rounded-full text-blue-800 font-semibold mb-6">
              <Shield className="h-5 w-5 mr-2" />
              Privacy Policy
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Privacy Matters to Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At GullyStrayCare, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <section className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Personal Information:</strong> When you donate, volunteer, or contact us, we may collect:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Donation amount and payment information</li>
                  <li>PAN and Aadhaar details (for 80G tax exemption certificates)</li>
                  <li>Address information for tax certificates</li>
                  <li>Communication preferences</li>
                </ul>
                <p><strong>Automatic Information:</strong> We may collect technical information such as IP address, browser type, and website usage patterns to improve our services.</p>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="border-l-4 border-amber-500 pl-6">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Process donations and issue tax exemption certificates</li>
                  <li>Send updates about our rescue operations and impact</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Coordinate volunteer activities and adoption processes</li>
                  <li>Comply with legal requirements and tax regulations</li>
                  <li>Improve our website and services</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Security</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>We do not sell, trade, or rent your personal information to third parties.</strong></p>
                <p>We may share information only in these circumstances:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>With payment processors (Razorpay) to complete donations</li>
                  <li>With government authorities for tax compliance (80G certificates)</li>
                  <li>With veterinary partners for animal care coordination</li>
                  <li>When required by law or to protect our legal rights</li>
                </ul>
                <p><strong>Security Measures:</strong> We implement industry-standard security measures including SSL encryption, secure payment processing, and restricted access to personal data.</p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Receive a copy of your data in a portable format</li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="border-l-4 border-red-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-700">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Enable social media features</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us About Privacy</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
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
            </section>

            {/* Updates */}
            <section className="text-center bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Policy Updates</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice. 
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;