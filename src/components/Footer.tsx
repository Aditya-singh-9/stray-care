import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logpy from '../assets/images/logo-1.jpg';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPaymentPage = () => {
    window.open('/payment', '_blank');
  };

  const handlePrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const handleTermsOfService = () => {
    navigate('/terms-of-service');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo & About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-full bg-white">
                <img src={Logpy} alt="GullyStray Care Logo" className="h-16 w-16 rounded-full object-cover border-2 border-amber-400 shadow-md" />
              </div>
              <div>
                <h3 className="text-xl font-bold">GullyStray Care</h3>
                <p className="text-sm text-blue-200">Compassion in Action</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Dedicated to rescuing, rehabilitating, and rehoming street animals across India. 
              Together, we're building a more compassionate world for all creatures.
            </p>

            <div className="flex space-x-4">
              <a href="https://x.com/gullystraycare" className="bg-gray-800 p-3 rounded-full hover:bg-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/gullystraycare/" className="bg-gray-800 p-3 rounded-full hover:bg-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-amber-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-amber-400 transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={openPaymentPage} className="text-gray-300 hover:text-amber-400 transition-colors">
                  Donate
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-amber-400" />
                <span className="text-gray-300 text-sm">+91 9323263322</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-amber-400" />
                <span className="text-gray-300 text-sm">gullystrayc@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-amber-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  G-2, Ground Floor, G Wing, KK Residency, Life Care Medical,
                  Azad Nagar, Hill No. 4, Ghatkopar West, Mumbai - 400086.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 GullyStray Care. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={handlePrivacyPolicy}
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={handleTermsOfService}
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Terms of Service
              </button>
              <a href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                80G Certificate
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;