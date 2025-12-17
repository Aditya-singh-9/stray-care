import React from 'react';
import { Heart, Users, Shield } from 'lucide-react';
import HeroImg from '../assets/images/hero.jpg';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPaymentPage = () => {
    window.open('/payment', '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-amber-100 px-4 py-2 rounded-full text-amber-800 font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Saving Lives, One Stray at a Time
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Every Stray Deserves 
              <span className="text-blue-600 block">Love & Care</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join us in our mission to rescue, rehabilitate, and rehome street animals. 
              Together, we can create a world where no animal suffers on the streets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={openPaymentPage}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-8 py-4 rounded-full hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                Donate Today
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="border-2 border-blue-300 text-blue-700 px-8 py-4 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 font-semibold text-lg"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
              src={HeroImg}
              alt="Animal care team"
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = HeroImg;
              }}
            />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border-l-4 border-amber-400">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">500+</p>
                  <p className="text-gray-600 text-sm">Animals Rescued</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border-l-4 border-blue-500">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">200+</p>
                  <p className="text-gray-600 text-sm">Happy Adoptions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;