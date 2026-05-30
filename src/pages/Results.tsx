import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SurgeryResult } from '../types';

export default function Results() {
  const [results, setResults] = useState<SurgeryResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic placeholders if DB has no values
  const defaultResults: SurgeryResult[] = [
    {
      id: "demo-1",
      title: "Advanced Hair Transplant (FUE)",
      description: "6 months post FUE hair follicle surgery showcasing immense density revival and completely natural-looking donor hair recovery.",
      before_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
      after_image_url: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600",
      treatment_type: "Hair Transplant"
    },
    {
      id: "demo-2",
      title: "Fractional CO2 Acne Laser Resurfacing",
      description: "Clinical elimination of severe facial scarring and acne hyperpigmentation spots after a sequence of three procedural sessions.",
      before_image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600",
      after_image_url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600",
      treatment_type: "Laser Treatment"
    },
    {
      id: "demo-3",
      title: "Medical Chemical Peel & PRP Face Glow",
      description: "Remarkable renewal of healthy epidermal balance, dark spots fading, and active skin hydration using customized acid blends and autologous platelet concentrates.",
      before_image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
      after_image_url: "https://images.unsplash.com/photo-1588776814546-1ffbb6e3b2f0?w=600",
      treatment_type: "PRP & Aesthetics"
    }
  ];

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from('surgery_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setResults(data);
        } else {
          setResults(defaultResults);
        }
      } catch (e) {
        console.warn("Could not query surgery_results, using high-quality Unsplash fallbacks.", e);
        setResults(defaultResults);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Header Banner */}
      <section className="bg-cream pt-28 pb-16 border-b border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-1 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary font-body">Clinical Outcomes</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-dark mb-4 tracking-tight">
            Treatment Results
          </h1>
          <p className="font-body text-base text-dark/70 max-w-xl mx-auto italic">
            Authentic before & after surgical and cosmetic transformations recorded at Prisha Clinic.
          </p>
          <div className="w-20 h-[2.5px] bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* Before & After grid view */}
      <section className="py-16 select-none flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="font-body text-sm text-primary font-medium">Reconciling gallery outcomes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-secondary/10 flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Before / After Images slider layout comparison */}
                    <div className="grid grid-cols-2 h-72 sm:h-80 bg-stone-100 overflow-hidden relative">
                      <div className="relative h-full overflow-hidden">
                        <img 
                          src={result.before_image_url} 
                          alt="Before surgical/aesthetics result" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white font-body text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                          Before Treatment
                        </div>
                      </div>
                      
                      <div className="relative h-full overflow-hidden border-l-2 border-dashed border-white">
                        <img 
                          src={result.after_image_url} 
                          alt="After surgical/aesthetics result" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute top-3 right-3 bg-secondary text-white font-body text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
                          After Transformation
                        </div>
                      </div>
                    </div>

                    {/* Badge Treatment */}
                    <span className="absolute bottom-4 left-4 bg-primary text-white font-body text-[10px] font-semibold tracking-wider uppercase py-1 px-3.5 rounded-full select-none shadow">
                      {result.treatment_type}
                    </span>
                  </div>

                  {/* Context Details */}
                  <div className="p-8">
                    <h3 className="font-heading text-xl font-bold text-dark mb-3">
                      {result.title}
                    </h3>
                    <p className="font-body text-sm text-dark/70 leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-2xl mx-auto mt-16 bg-cream p-6 rounded-2xl border border-secondary/10 text-center font-body text-xs text-dark/70 flex items-center justify-center space-x-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Actual results may vary. Consult Dr. Ankit Kumar Jain to map out a medically appropriate plan tailored for your individual parameters.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
