import React from 'react';
import { TrendingUp, Heart, Users, MapPin } from 'lucide-react';
import IMPACTImg from '../assets/images/impact.jpg';

const Impact: React.FC = () => {
  const stats = [
    { number: "5,247", label: "Animals Rescued", icon: Heart, color: "text-red-500", bgColor: "bg-red-100" },
    { number: "3,892", label: "Successful Adoptions", icon: Users, color: "text-green-500", bgColor: "bg-green-100" },
    { number: "12,000+", label: "Sterilizations Done", icon: TrendingUp, color: "text-blue-500", bgColor: "bg-blue-100" },
    { number: "45", label: "Cities Covered", icon: MapPin, color: "text-purple-500", bgColor: "bg-purple-100" }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Every number represents a life saved, a family completed, and a community made more compassionate
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Transforming Lives, One Story at a Time</h3>
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-6 border-l-4 border-amber-400">
                <h4 className="text-xl font-semibold mb-3 text-amber-300">Medical Miracles</h4>
                <p className="text-blue-100">
                  Over 15,000 medical procedures performed, giving critically injured animals a second chance at life.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border-l-4 border-green-400">
                <h4 className="text-xl font-semibold mb-3 text-green-300">Community Partnerships</h4>
                <p className="text-blue-100">
                  Working with 200+ local partners, shelters, and volunteers to create a network of care across India.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border-l-4 border-blue-400">
                <h4 className="text-xl font-semibold mb-3 text-blue-300">Education Impact</h4>
                <p className="text-blue-100">
                  Conducted 500+ awareness programs, reaching over 100,000 people with animal welfare education.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={IMPACTImg}
              alt="Animal care team"
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = IMPACTImg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-semibold text-lg mb-2">"Every rescue is a victory against suffering"</p>
              <p className="text-gray-200 text-sm">- Dr. Sarah, Chief Veterinarian</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;