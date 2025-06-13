import React from 'react';
import { Heart, Users, Award, Globe } from 'lucide-react';
import AboutImg from '../assets/images/About.jpg';
import LogoImg from '../assets/images/logo.jpg';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About GullyStrayCare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded with compassion and driven by purpose, we're dedicated to transforming 
            the lives of street animals across India.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6"></h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Gully Stray Care, an initiative by Gully Classes Foundation, was launched during the COVID-19 pandemic to support stray animals severely impacted by the lockdown. With streets deserted and resources cut off, countless animals were left hungry and injured. Our dedicated volunteers stepped in to provide food, clean water, and essential medical care — often in collaboration with compassionate local veterinarians.

            </p>
            <p className="text-gray-600 leading-relaxed">
              Even today, our mission continues. We are committed to raising awareness and guiding people over phone calls from 9:00 AM to 9:00 PM on how to care for stray animals. Whether it’s connecting you to local NGOs, animal welfare groups, or community resources — we ensure that no call for help goes unheard.
            </p>
          </div>
          <div className="relative">
            <img 
              src={AboutImg}
              alt="Animal care team"
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = LogoImg;
              }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Feature 
            color="amber" 
            title="Compassionate Care" 
            description="Every animal receives personalized attention and medical treatment" 
            Icon={Heart} 
          />
          <Feature 
            color="blue" 
            title="Community Driven" 
            description="Working with local communities to create lasting change" 
            Icon={Users} 
          />
          <Feature 
            color="green" 
            title="Excellence" 
            description="Maintaining highest standards in animal welfare and care" 
            Icon={Award} 
          />
          <Feature 
            color="purple" 
            title="Sustainable Impact" 
            description="Creating long-term solutions for street animal welfare" 
            Icon={Globe} 
          />
        </div>
      </div>
    </section>
  );
};

// Reusable feature card component:
interface FeatureProps {
  color: string;
  title: string;
  description: string;
  Icon: React.ElementType;
}

const Feature: React.FC<FeatureProps> = ({ color, title, description, Icon }) => (
  <div className={`text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-${color}-500`}>
    <div className={`bg-${color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
      <Icon className={`h-8 w-8 text-${color}-600`} />
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default About;
