export default function Gallery() {
  return (
    <section className="py-32 relative px-6 overflow-hidden bg-[#2a2420] text-cream">
      {/* Wood texture simulation using repeating linear gradients and noise could go here, for now using a dark warm tone + texture class */}
      <div className="absolute inset-0 bg-texture opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        
        <div className="w-full md:w-2/3">
          <div className="aspect-[16/9] overflow-hidden shadow-2xl relative">
            <img 
              src="/interior.jpg" 
              alt="Restaurant Interior" 
              className="w-full h-full object-cover sepia-[0.3]"
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Our Gallery</h2>
          <p className="text-cream/70 font-light mb-10 text-sm leading-relaxed max-w-sm">
            Step inside and experience the ambiance before you even arrive. From the first pour of wine to the last bite of dessert, every detail is considered.
          </p>
          <a href="#" className="border-b border-gold text-gold pb-1 uppercase tracking-widest text-xs font-medium hover:text-white hover:border-white transition-colors duration-300">
            View Full Gallery
          </a>
        </div>

      </div>
    </section>
  );
}
