import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { servicesList } from '../data';

interface ServicesProps {
  onNavigate: (page: string) => void;
  onSelectService?: (serviceName: string) => void;
}

export default function Services({ onNavigate, onSelectService }: ServicesProps) {

  const handleBook = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    }
    onNavigate('appointment');
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Header Banner */}
      <section className="bg-cream pt-28 pb-16 border-b border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-1.5 bg-black px-4 py-1.5 rounded-lg mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white font-body">Clinical Aesthetics</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-dark mb-4 uppercase tracking-tighter">
            Our Treatments & Services
          </h1>
          <p className="font-body text-base sm:text-lg text-paragraph max-w-xl mx-auto font-medium">
            Medically advanced. Personally tailored to restore health & youth.
          </p>
          <div className="w-20 h-[2.5px] bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-2xl p-8 border-l-[6px] border-l-primary border-y border-r border-blush shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-cream text-primary flex items-center justify-center text-xl mb-6 shadow-sm border border-blush">
                    {service.emoji}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-dark mb-3 uppercase tracking-tight">{service.name}</h3>
                  <p className="font-body text-sm text-dark/70 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>
                
                <div className="pt-5 border-t border-light mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-body uppercase font-black tracking-wider">Estimated Price</p>
                    <p className="font-body text-sm font-black text-dark uppercase">{service.priceRange}</p>
                  </div>
                  <button
                    onClick={() => handleBook(service.name)}
                    className="bg-black hover:bg-primary text-white font-body text-xs font-black px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer transform hover:scale-105 active:scale-95 uppercase"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
