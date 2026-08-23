import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessionStore } from "../store/useSessionStore";

export const LandingPage: React.FC = () => {
  const { restaurantSlug, tableNumber } = useParams<{
    restaurantSlug: string;
    tableNumber: string;
  }>();
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    if (restaurantSlug && tableNumber) {
      setSession(restaurantSlug, tableNumber);
    }
  }, [restaurantSlug, tableNumber, setSession]);

  const displayTableNumber = tableNumber || "?";

  const handleViewMenu = () => {
    if (restaurantSlug && tableNumber) {
      navigate(`/r/${restaurantSlug}/t/${tableNumber}/menu`);
    }
  };

  return (
    <section className="relative h-dvh w-full flex items-center justify-center overflow-hidden bg-ink">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
        style={{ backgroundImage: 'url("/images/restaurant-interior-2.jpg")' }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-navy/70 mix-blend-multiply"></div>

      {/* Watermark Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay">
        <img src="/logo-window.png" alt="" className="h-[60vh] object-contain invert opacity-10" />
      </div>
      
      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 py-6 md:px-12 md:py-8 backdrop-blur-md bg-navy/30 border-b border-white/10">
        {/* Logo area */}
        <div className="flex items-center gap-3">
          <div 
            className="h-10 md:h-12 bg-white shrink-0" 
            style={{ 
              aspectRatio: '1024/935',
              maskImage: 'url(/logo-window.png)', 
              WebkitMaskImage: 'url(/logo-window.png)', 
              maskSize: 'contain', 
              WebkitMaskSize: 'contain', 
              maskRepeat: 'no-repeat', 
              WebkitMaskRepeat: 'no-repeat', 
              maskPosition: 'center', 
              WebkitMaskPosition: 'center' 
            }}
          ></div>
          <div className="flex flex-col items-center">
            <span className="text-cream tracking-widest text-sm md:text-lg font-display uppercase">
              The Penthouse
            </span>
            <span className="text-gold tracking-[0.2em] text-[8px] md:text-[10px] uppercase">
              At Home Sweet Home
            </span>
          </div>
        </div>

        {/* Centered Table Number */}
        <div className="absolute left-1/2 -translate-x-1/2 border border-gold/50 text-gold px-6 py-2 md:px-8 md:py-2.5 uppercase tracking-widest text-xs md:text-sm backdrop-blur-md bg-navy/40 rounded-sm font-semibold shadow-lg whitespace-nowrap">
          Table {displayTableNumber}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={handleViewMenu}
            className="hidden md:block border border-gold text-cream px-6 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold hover:text-navy transition-colors"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-cream px-6 max-w-3xl mx-auto flex flex-col items-center mt-12">
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-6 text-gold animate-slide-up-fade">
          Welcome to The Penthouse
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight animate-slide-up-fade delay-100">
          An Italian table, <br className="hidden md:block" /> above it all.
        </h1>
        <p className="text-cream/80 text-sm md:text-base font-light max-w-lg mb-10 leading-relaxed animate-slide-up-fade delay-200">
          A tucked-away dining room for handmade pasta, warm evenings, and the
          pleasures of lingering a little longer.
        </p>

        {/* Replaced Explore the Menu with Table Number and Order Now */}
        <div className="flex justify-center w-full animate-slide-up-fade delay-300">
          <button
            onClick={handleViewMenu}
            className="border border-gold text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-all duration-300 min-w-[180px] hover:scale-105 animate-glow"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
    </section>
  );
};
