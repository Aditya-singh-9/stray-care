import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/images/logo-1.jpg'; // <-- Make sure path is correct

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openPaymentPage = () => {
    window.open('/payment', '_blank');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="GullyStray Care Logo" className="h-12 w-auto rounded-full shadow-sm" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gully StrayCare</h1>
              <p className="text-xs text-blue-600 font-medium">Compassion in Action</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 font-medium">About</button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 font-medium">Services</button>
            <button onClick={() => scrollToSection('impact')} className="text-gray-700 hover:text-blue-600 font-medium">Impact</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 font-medium">Contact</button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={openPaymentPage}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-2 rounded-full shadow-md hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Donate Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2 space-y-2">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Home</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">About</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Services</button>
              <button onClick={() => scrollToSection('impact')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Impact</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Contact</button>
              <button 
                onClick={openPaymentPage}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-full hover:from-amber-500 hover:to-yellow-600 transition-colors mt-4"
              >
                Donate Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
