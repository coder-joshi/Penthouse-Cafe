import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-cream shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img 
            src="/logo-window.png" 
            alt="The Penthouse Logo" 
            className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12 md:h-16'} ${!isScrolled ? 'filter invert' : ''}`}
          />
          <div className={`hidden md:block flex-col transition-opacity duration-300 ${isScrolled ? 'text-navy' : 'text-cream'}`}>
            <span className="block font-serif text-xl tracking-wider leading-none">THE PENTHOUSE</span>
            <span className="block text-[10px] tracking-[0.2em] uppercase mt-1">at Home Sweet Home</span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className={`hidden md:flex gap-8 items-center text-sm font-medium tracking-wide uppercase ${isScrolled ? 'text-navy' : 'text-cream'}`}>
          <a href="#menu" className="hover:text-gold transition-colors">Menu</a>
          <a href="#events" className="hover:text-gold transition-colors">Events</a>
          <a href="#catering" className="hover:text-gold transition-colors">Catering</a>
          <a href="#visit" className="hover:text-gold transition-colors">Visit</a>
          <a href="#reservations" className={`border px-5 py-2 transition-colors duration-300 ${isScrolled ? 'border-navy text-navy hover:bg-navy hover:text-cream' : 'border-cream text-cream hover:bg-cream hover:text-navy'}`}>
            Reservations
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${isScrolled ? 'text-navy' : 'text-cream'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cream shadow-md border-t border-navy/10 flex flex-col px-6 py-4 gap-4">
          <a href="#menu" className="text-navy uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
          <a href="#events" className="text-navy uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>Events</a>
          <a href="#catering" className="text-navy uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>Catering</a>
          <a href="#visit" className="text-navy uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>Visit</a>
          <a href="#reservations" className="text-center border border-navy text-navy px-5 py-3 mt-2 hover:bg-navy hover:text-cream transition-colors duration-300 uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>
            Reservations
          </a>
        </div>
      )}
    </nav>
  );
}
