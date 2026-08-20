export default function Catering() {
  return (
    <section id="catering" className="py-24 bg-navy text-cream px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <p className="uppercase tracking-[0.2em] text-xs text-gold font-medium mb-4">Private Dining</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-8">Catering & Events</h2>
          <p className="text-cream/80 font-light leading-relaxed mb-8">
            Bring the elegance of The Penthouse to your own table. Whether it's an intimate gathering or a grand celebration, our culinary team curates a menu tailored to your occasion, featuring the same dedication to quality and presentation.
          </p>
          
          <ul className="space-y-3 mb-10 text-sm font-light text-cream/70">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold rounded-full block"></span>
              Bespoke multi-course menus
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold rounded-full block"></span>
              Sommelier-selected wine pairings
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold rounded-full block"></span>
              Professional service staff
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold rounded-full block"></span>
              Floral and table styling consultation
            </li>
          </ul>

          <a href="#contact" className="inline-block border border-gold text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-colors duration-300">
            Inquire Now
          </a>
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="aspect-square md:aspect-[4/5] rounded-sm overflow-hidden relative">
             {/* Using interior as placeholder, would ideally be food/chef */}
            <img 
              src="/interior.jpg" 
              alt="Catering presentation" 
              className="w-full h-full object-cover grayscale-[0.3] contrast-125"
            />
            <div className="absolute inset-0 bg-navy/20 mix-blend-multiply"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
