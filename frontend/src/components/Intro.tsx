export default function Intro() {
  return (
    <section className="py-24 md:py-32 bg-cream bg-texture px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="uppercase tracking-[0.2em] text-xs text-gold font-medium mb-6">
            A Room with a Story
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-8 leading-tight">
            Come up for dinner. <br />
            Stay for the feeling.
          </h2>
          <p className="text-charcoal/80 leading-relaxed mb-12 font-light">
            Perched above the neighborhood, our intimate dining room brings a little old-world romance to every plate. Come as you are, settle in, and let the evening unfold.
          </p>
          
          <div className="flex flex-col gap-2 text-sm border-l-2 border-gold pl-6">
            <span className="uppercase tracking-widest text-xs text-navy/60 font-medium">Find Us</span>
            <span className="text-charcoal">123 Bellwether Lane</span>
            <span className="text-charcoal">New York, NY 10012</span>
          </div>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-xl relative z-10">
            <img 
              src="/interior.jpg" 
              alt="Intimate dining atmosphere" 
              className="w-full h-full object-cover sepia-[0.2] contrast-125"
            />
          </div>
          {/* Decorative offset border */}
          <div className="absolute -inset-4 border border-navy/20 z-0 hidden md:block"></div>
          {/* Motif accent */}
          <img 
            src="/logo-window.png" 
            alt="" 
            className="absolute -bottom-10 -left-10 h-32 opacity-10 z-20 pointer-events-none"
          />
        </div>

      </div>
    </section>
  );
}
