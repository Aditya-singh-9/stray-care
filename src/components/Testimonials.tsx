import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Dog Adopter",
      image: "src/assets/images/testimonial-1.jpg",
      content: "GullyStray Care helped me find my best friend, Bruno. The team was incredibly supportive throughout the adoption process. Bruno was well-cared for and healthy when I adopted him. It's been 2 years now, and he's the joy of my life!",
      rating: 5
    },
    {
      name: "Dr. Amit Patel",
      role: "Veterinarian Partner",
      image: "src/assets/images/testimonial-2.jpg",
      content: "Working with GullyStray Care has been incredibly rewarding. Their dedication to animal welfare is unmatched. The professionalism and care they show towards every rescued animal is truly inspiring.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Monthly Donor",
      image: "src/assets/images/testimonial-3.jpg",
      content: "I've been supporting GullyStray Care for 3 years now. The transparency in their operations and regular updates about the impact of my donations gives me confidence that my money is making a real difference.",
      rating: 5
    },
    {
      name: "Meera Singh",
      role: "Volunteer",
      image: "src/assets/images/testimonial-4.jpg",
      content: "Volunteering with GullyStray Care has been life-changing. The team is passionate, organized, and truly cares about every animal they rescue. Being part of this mission is incredibly fulfilling.",
      rating: 5
    }
  ];

  const openPaymentPage = () => {
    window.open('/payment', '_blank');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the amazing people who have been part of our journey to make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-amber-400 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  onError={(e) => {
                    const fallbackImages = [
                      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
                      "https://images.pexels.com/photos/612809/pexels-photo-612809.jpeg?auto=compress&cs=tinysrgb&w=150",
                      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
                      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
                    ];
                    e.currentTarget.src = fallbackImages[index];
                  }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Success Stories</h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Whether you're looking to adopt, volunteer, or support our cause, you can be part of 
            creating more happy endings for street animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openPaymentPage}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-yellow-600 transition-colors"
            >
              Start Your Journey
            </button>
            <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Share Your Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;