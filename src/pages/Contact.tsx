import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

interface ContactProps {
  onSuccessMessage: (message: string) => void;
}

export default function Contact({ onSuccessMessage }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccessMessage("Thank you! We'll get back to you within 24 hours.");
      setFormData({ name: '', phone: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Header Banner */}
      <section className="bg-cream pt-28 pb-12 border-b border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-dark mb-4 tracking-tight">
            Get In Touch
          </h1>
          <p className="font-body text-base text-dark/70 max-w-xl mx-auto italic">
            Connect directly with our support specialists. We are delighted to answer all of your clinical questions.
          </p>
          <div className="w-16 h-[2.5px] bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* Main layout */}
      <section className="py-16 select-none flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: Cards of Contact */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="bg-white p-8 rounded-3xl border border-secondary/15 shadow-sm space-y-8">
                <h3 className="font-heading text-2xl font-bold text-dark">Clinic Coordinates</h3>

                <ul className="space-y-6 font-body text-sm text-dark">
                  <li className="flex items-start space-x-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Our Address</h4>
                      <p className="mt-1 leading-relaxed text-sm">
                        B 106, Narmadapuram Rd, behind Axis Bank, in front of Sahara Hospital, Vidya Nagar, Bhopal, Madhya Pradesh 462026
                      </p>
                    </div>
                  </li>

                  <li className="flex items-center space-x-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Call Us</h4>
                      <a href="tel:+917875379557" className="mt-1 font-semibold block text-sm select-all">
                        +91 7875379557
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center space-x-4">
                    <span className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 fill-current" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">WhatsApp Dispatch</h4>
                      <a 
                        href="https://wa.me/917875379557" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-1 font-semibold text-green-700 block text-sm underline select-all"
                      >
                        wa.me/917875379557
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center space-x-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Email Query</h4>
                      <a href="mailto:ankitjain@prishaskin.com" className="mt-1 font-semibold block text-sm select-all">
                        ankitjain@prishaskin.com
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start space-x-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Operational Hours</h4>
                      <p className="mt-1 text-sm font-semibold">Monday – Saturday: 11:00 AM – 7:00 PM</p>
                      <p className="text-gray-400 text-xs mt-0.5">Sunday: Closed</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-secondary/15 shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-dark mb-6">Send a Digital Inquiry</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-body text-sm text-dark">
                  <div>
                    <label className="block font-medium mb-2" htmlFor="name">Your Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Priyansh"
                      className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="font-body text-sm text-dark">
                  <label className="block font-medium mb-2" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="font-body text-sm text-dark">
                  <label className="block font-medium mb-2" htmlFor="message">Your Consultation Request or Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What questions or concerns can Dr. Ankit clear up for you?"
                    className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-primary text-white font-body py-4 rounded-xl font-bold tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-md shadow-secondary/15 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry Message'}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Embedded Google Maps locator */}
          <div className="mt-16 bg-white p-4 rounded-3xl border border-secondary/15 shadow-md overflow-hidden">
            <h4 className="font-heading text-lg font-bold text-dark px-2 mb-4">Location Finder Map</h4>
            <div className="rounded-2xl overflow-hidden border border-light">
              <iframe 
                src="https://maps.google.com/maps?q=Prisha+Skin+and+Hair+Clinic+Bhopal&output=embed" 
                width="100%" 
                height="385" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Bhopal Prisha Clinic Maps Finder"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
