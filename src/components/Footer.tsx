import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, Instagram, Facebook, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'results', label: 'Results' },
    { id: 'appointment', label: 'Appointment' },
    { id: 'contact', label: 'Contact' }
  ];

  const popularServices = [
    'CO2 Laser Treatment',
    'Hair Transplant (FUE)',
    'PRP Therapy',
    'Chemical Peel',
    'Laser Hair Removal',
    'Acne Treatment'
  ];

  return (
    <footer className="bg-dark text-cream pt-16 pb-8 border-t border-primary/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1 - Brand Profile */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://i.ibb.co/HDjz6nFD/Whats-App-Image-2026-05-29-at-3-08-39-PM.jpg"
                alt="Prisha Clinic logo"
                className="w-8 h-8 rounded-full object-cover border border-secondary/20 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="font-heading text-2xl font-bold text-white tracking-tight">
                Prisha Skin & Hair
              </span>
            </div>
            
            <p className="font-body text-sm text-blush/80 leading-relaxed">
              Experience gold-standard clinical aesthetics & hair restoration under the trusted care of Dr. Ankit Kumar Jain in Bhopal.
            </p>
            
            {/* Social channels */}
            <div className="flex items-center space-x-4 pt-4">
              <a 
                href="https://wa.me/917875379557" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center hover:bg-secondary text-white transition-colors duration-200 cursor-pointer"
                title="WhatsApp Contact"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center hover:bg-secondary text-white transition-colors duration-200 cursor-pointer"
                title="Instagram Page"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center hover:bg-secondary text-white transition-colors duration-200 cursor-pointer"
                title="Facebook Profile"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wider uppercase border-b border-secondary/30 pb-2">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center space-x-1 font-body text-sm text-blush/85 hover:text-white transition-colors duration-200 cursor-pointer group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Popular Services list */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wider uppercase border-b border-secondary/30 pb-2">
              Our Treatments
            </h3>
            <ul className="space-y-2.5">
              {popularServices.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      onNavigate('services');
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center space-x-2 text-left font-body text-sm text-blush/85 hover:text-white transition-colors cursor-pointer group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>{service}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Info block */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wider uppercase border-b border-secondary/30 pb-2">
              Get in Touch
            </h3>
            
            <ul className="space-y-3.5 font-body text-sm text-blush/85">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>
                  B 106, Narmadapuram Rd, Vidya Nagar, Bhopal, MP 462026
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="tel:+917875379557" className="hover:text-white cursor-pointer transition-colors">
                  +91 7875379557
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:ankitjain@prishaskin.com" className="hover:text-white cursor-pointer transition-colors">
                  ankitjain@prishaskin.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Mon - Sat: 11:00 AM - 7:00 PM</p>
                  <p className="text-gray-400 text-xs">Sunday: Closed (By emergency inquiry only)</p>
                </div>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom copyright statement */}
        <div className="border-t border-primary/20 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between font-body text-xs text-blush/70">
          <p>© {currentYear} Prisha Skin & Hair Clinic. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-center sm:text-right">
            Designed with ❤️ for <span className="font-semibold text-white">Dr. Ankit Kumar Jain</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
