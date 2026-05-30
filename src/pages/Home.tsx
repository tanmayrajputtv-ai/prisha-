import React from 'react';
import { Calendar, Shield, Sparkles, Award, Star, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';
import { ServiceItem, ReviewItem } from '../types';
import { servicesList, patientReviews } from '../data';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // Use first 6 services for preview
  const popularServices = servicesList.slice(0, 6);

  // Before & After comparisons for homepage preview
  const previewResults = [
    {
      title: "Hair Transplant (FUE)",
      description: "6 months post-treatment FUE procedure to regain hair line density.",
      before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
      after: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600",
      treatment: "Trichology"
    },
    {
      title: "CO2 Laser Treatment",
      description: "Pristine scar smoothing & acne pigmentation clearing after 3 sessions.",
      before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600",
      after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600",
      treatment: "Dermatology"
    },
    {
      title: "Skin Rejuvenation (PRP)",
      description: "Natural dermal plumping & deep hydration renewal.",
      before: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
      after: "https://images.unsplash.com/photo-1588776814546-1ffbb6e3b2f0?w=600",
      treatment: "Aesthetics"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[100vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(12, 12, 12, 0.9) 0%, rgba(10, 24, 52, 0.75) 100%), url('https://i.ibb.co/KdGjtqv/Whats-App-Image-2026-05-29-at-3-08-40-PM.jpg')`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-lg mb-6 border border-white/20 animate-fade-in">
            <span className="text-[11px] font-black tracking-widest font-body uppercase text-primary">✦ Trusted by 3000+ Patients in Bhopal</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8.5xl font-black uppercase leading-[0.9] tracking-[0.05em] mb-6 drop-shadow-md">
            Restore Your Skin. <br />
            <span className="text-primary tracking-tighter">Reclaim Confidence.</span>
          </h1>

          {/* Description */}
          <p className="font-body text-base sm:text-lg lg:text-xl font-medium text-white/90 max-w-2xl mb-10 leading-relaxed shadow-sm">
            Expert clinical dermatology, laser correction, and advanced FUE hair transplantation guided by Dr. Ankit Kumar Jain in Vidya Nagar, Bhopal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full max-w-lg">
            <button
              onClick={() => onNavigate('appointment')}
              className="w-full sm:w-auto bg-white text-black border-2 border-white hover:bg-transparent hover:text-white font-body font-black text-xs tracking-widest px-8 py-4 rounded-lg transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center space-x-2 uppercase"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-body font-black text-xs tracking-widest px-8 py-4 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 uppercase"
            >
              <span>Our Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce select-none">
          <span className="font-body text-[10px] font-black text-white/70 mb-1 tracking-widest uppercase">Scroll Info</span>
          <div className="w-1 h-6 bg-white/30 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-cream py-10 border-y border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-blush/80">
            <div className="pt-4 lg:pt-0">
              <p className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter">3000+</p>
              <p className="font-body text-[11px] font-black tracking-wider text-paragraph mt-1 uppercase">Patients Treated</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter">10+ Years</p>
              <p className="font-body text-[11px] font-black tracking-wider text-paragraph mt-1 uppercase">Clinical Experience</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter">98%</p>
              <p className="font-body text-[11px] font-black tracking-wider text-paragraph mt-1 uppercase">Satisfaction Rate</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter">25+</p>
              <p className="font-body text-[11px] font-black tracking-wider text-paragraph mt-1 uppercase font-semibold">Treatments Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Why Patients Trust Dr. Ankit</h2>
            <p className="section-subtitle">Excellence in Aesthetic Dermatology & Scalp Surgery</p>
            <div className="w-16 h-[2px] bg-primary mx-auto -mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-light p-8 rounded-2xl border-t-4 border-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-dark mb-3">Advanced Laser Technology</h3>
              <p className="font-body text-sm text-dark/70 leading-relaxed">
                We employ global gold-standard technology including fractionated CO2 skin lasers and state-of-the-art scalp follicular extraction toolsets.
              </p>
            </div>

            <div className="bg-light p-8 rounded-2xl border-t-4 border-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-dark mb-3">Expert Dermatologist</h3>
              <p className="font-body text-sm text-dark/70 leading-relaxed">
                Dr. Ankit Kumar Jain (MBBS, MD Dermatology) brings a decade of surgical precision, extensive fellowships, and premium safety standards to Bhopal.
              </p>
            </div>

            <div className="bg-light p-8 rounded-2xl border-t-4 border-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-dark mb-3">Personalized Care</h3>
              <p className="font-body text-sm text-dark/70 leading-relaxed">
                No cookie-cutter procedures. We craft holistic, patient-centric treatment files mapped specifically to your biological dermal needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Dr. Ankit - Doctor Profile Section */}
      <section className="bg-cream/40 py-20 border-t border-b border-light select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Portrait Image column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-2.5 bg-white rounded-2xl border border-blush shadow-lg max-w-sm w-full">
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-2xl m-1 pointer-events-none opacity-25"></div>
                <img 
                  src="https://i.ibb.co/KdGjtqv/Whats-App-Image-2026-05-29-at-3-08-40-PM.jpg" 
                  alt="Dr. Ankit Kumar Jain Portrait" 
                  referrerPolicy="no-referrer"
                  className="rounded-xl w-full h-[400px] object-cover object-top border border-light"
                />
              </div>
            </div>

            {/* Dr Ankit short description column */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="font-body text-xs font-black text-primary uppercase tracking-widest mb-2">Featured Doctor Profile</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-dark mb-2 uppercase tracking-tight">Dr. Ankit Kumar Jain</h2>
              <p className="font-heading text-xs font-bold text-secondary uppercase tracking-widest mb-4">MBBS, MD (Dermatology, Venereology & Leprosy)</p>
              <div className="w-16 h-[3px] bg-primary mb-6"></div>
              
              <p className="font-body text-sm text-dark/75 leading-relaxed mb-6">
                Dr. Ankit Kumar Jain is a premier aesthetic board-certified dermatologist and advanced FUE hair restoration surgeon in Bhopal. Regarded for his elite painless treatment methods, and absolute accuracy in skin and hair restoration processes.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-secondary/10">
                  <p className="font-heading text-xl font-bold text-primary">10+ Years</p>
                  <p className="font-body text-[10px] uppercase font-bold text-stone-400 mt-0.5">Clinical Rigor</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-secondary/10">
                  <p className="font-heading text-xl font-bold text-primary">3,000+</p>
                  <p className="font-body text-[10px] uppercase font-bold text-stone-400 mt-0.5">Patients Healed</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="bg-primary hover:bg-dark text-white font-body font-black text-xs tracking-widest px-8 py-3.5 rounded-lg transition-colors duration-300 cursor-pointer uppercase border border-primary hover:border-dark"
                >
                  View Full Credentials
                </button>
                <button
                  onClick={() => onNavigate('appointment')}
                  className="bg-transparent border border-stone-300 text-dark hover:bg-light font-body font-black text-xs tracking-widest px-8 py-3.5 rounded-lg transition-colors duration-300 cursor-pointer uppercase"
                >
                  Request Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Grid */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Our Most Popular Treatments</h2>
            <p className="section-subtitle">Medically Advanced Skin & Hair Restoration</p>
            <div className="w-16 h-[2px] bg-primary mx-auto -mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularServices.map((service) => (
              <div key={service.id} className="card bg-white h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-full bg-light flex items-center justify-center text-2xl mb-6 shadow-sm border border-secondary/10">
                    {service.emoji}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-dark mb-3">{service.name}</h3>
                  <p className="font-body text-sm text-dark/70 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-light/80 flex items-center justify-between">
                  <span className="font-body text-xs font-semibold text-secondary uppercase tracking-wider">
                    {service.priceRange}
                  </span>
                  <button
                    onClick={() => onNavigate('appointment')}
                    className="font-body text-xs font-bold text-primary hover:text-dark flex items-center space-x-1 cursor-pointer transition-colors group"
                  >
                    <span>Book →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center space-x-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-body font-bold text-sm tracking-wider transition-all duration-300 cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Before & After Preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Real Results from Real Patients</h2>
            <p className="section-subtitle">Authentic transformation journals by Dr. Ankit</p>
            <div className="w-16 h-[2px] bg-primary mx-auto -mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {previewResults.map((item, index) => (
              <div key={index} className="bg-light rounded-2xl overflow-hidden shadow-sm border border-secondary/10 flex flex-col h-full">
                {/* Images Container */}
                <div className="grid grid-cols-2 relative h-64 overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={item.before} 
                      alt="Before treatment" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full font-body">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={item.after} 
                      alt="After treatment" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-secondary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full font-body">
                      After
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary font-body tracking-wider shadow">
                    {item.treatment}
                  </div>
                </div>
                
                {/* Descriptive Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-dark mb-2">{item.title}</h3>
                    <p className="font-body text-xs text-dark/70 leading-relaxed mb-4">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('results')}
                    className="text-left font-body text-xs font-bold text-primary hover:text-dark flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>View comparison folder</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('results')}
              className="font-body text-sm font-bold text-primary hover:text-dark inline-flex items-center space-x-1 cursor-pointer underline underline-offset-4"
            >
              <span>View All Clinical Results →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real Google Reviews */}
      <section className="bg-light py-20 border-t border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle">Verified Patient Feedback from Bhopal</p>
            <div className="w-16 h-[2px] bg-primary mx-auto -mt-6"></div>
          </div>

          {/* Testimonial slider layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patientReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-2xl border border-secondary/10 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 mb-4">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-dark/80 italic leading-relaxed mb-6">
                    "{rev.text}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-4 border-t border-light">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-body font-bold flex items-center justify-center text-xs shadow-inner">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-bold text-dark">{rev.name}</h4>
                    <p className="font-body text-[10px] text-gray-400 font-medium">Bhopal Resident</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA Banner */}
      <section className="bg-primary py-16 text-center text-white relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-black/10 opacity-40 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <img
            src="https://i.ibb.co/HDjz6nFD/Whats-App-Image-2026-05-29-at-3-08-39-PM.jpg"
            alt="Prisha Clinic logo"
            className="w-12 h-12 rounded-full object-cover border border-white/25 shadow-md mb-4"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-heading text-3xl sm:text-5xl font-bold mb-4 tracking-tight text-white shadow-sm">
            Ready to Transform Your Skin & Hair?
          </h2>
          <p className="font-body text-base text-blush/90 max-w-xl mb-8 font-light">
            Book your professional consultation folder today with Dr. Ankit Kumar Jain in Vidya Nagar and find the treatment plan tailored for you.
          </p>
          <button
            onClick={() => onNavigate('appointment')}
            className="bg-white text-primary hover:bg-cream hover:text-dark px-10 py-4 rounded-full font-body font-bold text-sm tracking-wider transition-all duration-300 shadow-xl cursor-pointer"
          >
            Request Consultation Folder
          </button>
        </div>
      </section>
    </div>
  );
}
