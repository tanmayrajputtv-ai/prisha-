import React from 'react';
import { Check, ShieldCheck, Heart, Users, Calendar } from 'lucide-react';

export default function About() {
  const qualifications = [
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    "Doctor of Medicine (MD) in Dermatology, Venereology & Leprosy",
    "Fellowship in Advanced Hair Transplant Surgery (FUE Specialist)",
    "Certified CO2 Fractional Laser Specialist"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Banner */}
      <section 
        className="relative py-24 sm:py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 102, 255, 0.75) 100%), url('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-12">
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">Dr. Ankit Kumar Jain</h1>
          <p className="font-body text-base sm:text-lg text-white font-black tracking-widest uppercase max-w-xl mx-auto">
            Founder & Chief Surgeon — Prisha Clinic
          </p>
        </div>
      </section>

      {/* Doctor Bio Section */}
      <section className="bg-white py-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Portrait photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-3 bg-cream rounded-2xl border border-blush shadow-lg max-w-sm w-full">
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-2xl m-1 pointer-events-none opacity-30"></div>
                <img 
                  src="https://i.ibb.co/KdGjtqv/Whats-App-Image-2026-05-29-at-3-08-40-PM.jpg" 
                  alt="Dr. Ankit Kumar Jain Portrait" 
                  referrerPolicy="no-referrer"
                  className="rounded-xl w-full h-[400px] object-cover object-top border border-blush"
                />
              </div>
            </div>

            {/* Right Column: Bio Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="font-body text-xs font-black text-primary uppercase tracking-widest mb-2">Inspirational Leadership</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-dark mb-4 uppercase tracking-tight">Meet the Surgeon</h2>
              <div className="w-16 h-[3px] bg-primary mb-6"></div>
              
              <p className="font-body text-base text-dark/80 leading-relaxed mb-6">
                Dr. Ankit Kumar Jain is a highly qualified dermatologist and hair transplant surgeon based in Vidya Nagar, Bhopal. Known for advanced laser treatments, painless procedures, and exceptional patient outcomes, Dr. Jain brings over 10 years of clinical expertise to every medical checkup.
              </p>
              
              <p className="font-body text-base text-dark/80 leading-relaxed mb-8">
                He is committed to utilizing globally certified medical technologies — including CO2 skin resurfacing, FUE microsurgery, and bio-enhanced follicular therapies — to deliver safe, highly reliable, and personalized skin and hair restoration plans.
              </p>

              {/* Qualifications checklist */}
              <h3 className="font-heading text-lg font-black text-dark mb-4 uppercase">Professional Qualifications:</h3>
              <ul className="space-y-3 font-body text-sm text-dark/85">
                {qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Mission Quote Accent */}
      <section className="bg-cream py-16 text-center select-none border-y border-blush">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-3xl text-primary block mb-4 font-black">“</span>
          <p className="font-heading text-2.5xl sm:text-3xl font-black text-dark uppercase tracking-tight leading-relaxed mb-4">
            Our mission is to help every patient feel confident in their own skin through science-backed, compassionate care.
          </p>
          <div className="w-8 h-1 bg-primary mx-auto"></div>
        </div>
      </section>

      {/* Clinic Interior section */}
      <section className="bg-white py-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="font-body text-xs font-black text-primary uppercase tracking-widest mb-2">Our Space</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-dark mb-4 uppercase tracking-tight">A Sanctuary of Well-being</h2>
              <div className="w-16 h-[3px] bg-primary mb-6"></div>
              <p className="font-body text-base text-dark/70 leading-relaxed mb-6">
                Prisha Skin & Hair Clinic is designed with safety, sterility, and premium patient comfort as the focal priorities. Nestled in Vidya Nagar near Narmadapuram Rd, our clinic hosts state-of-the-art procedure chambers, advanced sterilization corridors, and a cozy reception lobby.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center font-body">
                  <div className="flex items-center justify-center text-primary mb-2">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-dark uppercase tracking-wide">100% Sterile</h4>
                </div>
                <div className="text-center font-body">
                  <div className="flex items-center justify-center text-primary mb-2">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-dark uppercase tracking-wide">Painless Care</h4>
                </div>
                <div className="text-center font-body">
                  <div className="flex items-center justify-center text-primary mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-dark uppercase tracking-wide">Expert Staff</h4>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6">
              <div className="bg-white p-4 rounded-2xl border border-blush shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800"
                  alt="Clinic Interior View"
                  referrerPolicy="no-referrer"
                  className="rounded-xl w-full h-[320px] object-cover"
                />
                <p className="font-body text-xs text-paragraph italic text-center mt-3 text-gray-500 font-medium">
                  Prisha Skin & Hair Clinical Lounge - Vidya Nagar, Bhopal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
