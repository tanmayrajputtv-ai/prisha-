import React from 'react';
import { Check, Info, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onNavigate: (page: string) => void;
  onSelectService?: (serviceName: string) => void;
}

export default function Pricing({ onNavigate, onSelectService }: PricingProps) {

  const handleBookPlan = (planName: string) => {
    if (onSelectService) {
      onSelectService(`Membership Package: ${planName}`);
    }
    onNavigate('appointment');
  };

  const plans = [
    {
      name: "BASIC CARE",
      price: "₹1,499",
      period: "year",
      description: "Essential wellness maintenance for healthy skin and scalp.",
      popular: false,
      features: [
        "2 Comprehensive Skin Consultations",
        "1 Therapeutic Medical Facial",
        "Digital Skin Analysis",
        "10% Discount on All Laser Treatments",
        "Standard Chat Access Support"
      ],
      btnStyle: "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
    },
    {
      name: "STANDARD CARE",
      price: "₹3,999",
      period: "year",
      description: "Our signature annual plan combining analysis with core treatments.",
      popular: true,
      features: [
        "4 Comprehensive Skin Consultations",
        "2 Therapeutic Medical Facials",
        "Complete Microscopic Skin & Scalp Analysis",
        "1 Autologous PRP Session (Scalp or Skin)",
        "20% Discount on All Major Laser/FUE Treatments",
        "Priority Booking Window Placement"
      ],
      btnStyle: "bg-black text-white hover:bg-primary border-2 border-black hover:border-primary"
    },
    {
      name: "PREMIUM CARE",
      price: "₹8,999",
      period: "year",
      description: "Elite dermatological care plan with unlimited consultation support.",
      popular: false,
      features: [
        "Unlimited On-demand Consultations",
        "Quarterly Medical Facials",
        "Full Skin + Hair Density Analysis",
        "2 Autologous PRP Regenerative Sessions",
        "1 Medical Chemical Peel Included",
        "30% Discount on All General Procedures",
        "Emergency Same-day Priority Appointment",
        "Personal WhatsApp Support Line with Dr. Ankit"
      ],
      btnStyle: "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Header Banner */}
      <section className="bg-cream pt-28 pb-16 border-b border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-1.5 bg-black px-4 py-1.5 rounded-lg mb-3">
            <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white font-body">Exclusive Value</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-dark mb-4 uppercase tracking-tighter">
            Membership Plans
          </h1>
          <p className="font-body text-base text-paragraph max-w-xl mx-auto font-medium">
            Invest in your skin with our meticulously designed, annual dermatologist-led packages.
          </p>
          <div className="w-20 h-[2.5px] bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* Pricing packages section */}
      <section className="py-16 select-none flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-8 relative flex flex-col justify-between border transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg lg:scale-105 z-10' 
                    : 'border-blush shadow-sm hover:border-primary'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-black py-1 px-4 rounded-lg tracking-widest uppercase">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <p className="font-body text-[11px] font-black text-primary tracking-widest uppercase mb-2">{plan.name}</p>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter">{plan.price}</span>
                    <span className="font-body text-sm text-gray-400 font-bold ml-1">/{plan.period}</span>
                  </div>

                  <p className="font-body text-xs text-dark/75 leading-relaxed mb-8 border-b border-light pb-4 font-medium">
                    {plan.description}
                  </p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm font-body text-dark/85 leading-relaxed">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-dark/95">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBookPlan(plan.name)}
                  className={`w-full py-3.5 rounded-lg font-body text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer text-center ${plan.btnStyle}`}
                >
                  Book Package Now
                </button>
              </div>
            ))}
          </div>

          {/* Value Disclaimer */}
          <div className="max-w-2xl mx-auto mt-16 bg-cream p-6 rounded-lg border border-blush text-center font-body text-xs text-dark/70 flex items-center justify-center space-x-2 font-medium">
            <Info className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Membership benefits, consultation credits, and discount allocations apply directly in-clinic upon registration validation.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
