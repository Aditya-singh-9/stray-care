import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions, want to volunteer, or need emergency rescue services? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Rescue</h4>
                    <p className="text-gray-600">+91 9323263322 </p>
                    <p className="text-gray-600">+91 9892788396 </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">gullystrayc@gmail.com</p>
                    
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">G-2, Ground Floor, G Wing, KK Residency, Life Care Medical,

Azad Nagar, Hill No. 4</p>
                    <p className="text-gray-600">Ghatkopar West,

Mumbai - 400086</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Office Hours</h4>
                    <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sat - Sun: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-amber-600 font-medium">Emergency services: 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Call Now</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                <option value="emergency">Emergency Rescue</option>
                <option value="adoption">Adoption Inquiry</option>
                <option value="volunteer">Volunteer Opportunity</option>
                <option value="donation">Donation Query</option>
                <option value="general">General Inquiry</option>
              </select>

              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-colors font-semibold flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;