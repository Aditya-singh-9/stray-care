import React from 'react';
import { Stethoscope, Home, Scissors, GraduationCap, Ambulance, Users } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Ambulance,
      title: "Emergency Rescue",
      description: "Our emergency response team is available 9:00 AM to 9:00PM for guidance over a call",
      color: "bg-red-100 text-red-600",
      borderColor: "border-red-400"
    },
    {
      icon: Stethoscope,
      title: "Medical Treatment",
      description: "Comprehensive veterinary care including surgeries and treatments",
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-400"
    },
    {
      icon: Scissors,
      title: "Sterilization Program",
      description: "Population control through humane sterilization and vaccination",
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-400"
    },
    {
      icon: Home,
      title: "Adoption Services",
      description: "Finding loving forever homes for rescued and rehabilitated animals",
      color: "bg-amber-100 text-amber-600",
      borderColor: "border-amber-400"
    },
    {
      icon: GraduationCap,
      title: "Community Education",
      description: "Awareness programs on responsible pet ownership and animal welfare",
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-400"
    },
    {
      icon: Users,
      title: "Volunteer Programs",
      description: "Engaging volunteers in rescue operations and care activities",
      color: "bg-indigo-100 text-indigo-600",
      borderColor: "border-indigo-400"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive care programs designed to address every aspect of street animal welfare
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className={`bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-l-4 ${service.borderColor}`}>
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Need Emergency Help?</h3>
              <p className="text-lg opacity-90 mb-6">
                Our emergency response team is available 9:00 AM to 9:00PM for animal rescue operations. Don't hesitate to contact us if you spot an animal in distress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+91 93232 63322" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center">
                  Call Emergency: +91 93232 63322 
                </a>
                <a href="mailto:emergency@gullystracare.org" className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                  Email Us
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="src/assets/images/emergency-rescue.jpg"
                alt="Emergency rescue"
                className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=600";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;