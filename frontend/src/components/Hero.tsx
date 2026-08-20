export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/interior.jpg")' }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-navy/70 mix-blend-multiply"></div>
      
      {/* Watermark Motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none mix-blend-overlay">
        <img src="/logo-window.png" alt="" className="h-[60vh] object-contain filter invert opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-cream px-6 max-w-3xl mx-auto flex flex-col items-center">
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-6 text-gold">
          Welcome to The Penthouse
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          An Italian table, <br className="hidden md:block"/> above it all.
        </h1>
        <p className="text-cream/80 text-sm md:text-base font-light max-w-lg mb-10 leading-relaxed">
          A tucked-away dining room for handmade pasta, warm evenings, and the pleasures of lingering a little longer.
        </p>
        <a 
          href="#menu" 
          className="border border-gold text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-colors duration-300"
        >
          Explore the Menu
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-pulse">
        <span className="uppercase tracking-[0.2em] text-[10px] text-cream">Scroll to discover</span>
        <div className="w-[1px] h-12 bg-cream/50"></div>
      </div>
    </section>
  );
}
