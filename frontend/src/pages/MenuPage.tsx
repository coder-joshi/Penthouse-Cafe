import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuCategoryNav } from '../components/menu/MenuCategoryNav';
import { MenuBentoGrid } from '../components/menu/MenuBentoGrid';
import { ItemDetailSheet } from '../components/menu/ItemDetailSheet';
import { MyBillSheet } from '../components/cart/MyBillSheet';
import { categories, getItemsByCategory } from '../data/menu';
import { useCartStore } from '../store/useCartStore';
import { useSessionStore } from '../store/useSessionStore';

export const MenuPage: React.FC = () => {
  const { itemId: routeItemId } = useParams<{
    itemId?: string;
  }>();
  const { } = useCartStore();
  const { placedOrders, getGrandTotal } = useSessionStore();
  const [isBillOpen, setIsBillOpen] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(routeItemId || null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Open sheet if route has itemId
  useEffect(() => {
    if (routeItemId) {
      setSelectedItemId(routeItemId);
    }
  }, [routeItemId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategoryId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleCloseSheet = () => {
    setSelectedItemId(null);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linen relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-4 z-40 text-charcoal-text/60 hover:text-charcoal-text p-2 flex items-center justify-center rounded-full bg-paper/80 backdrop-blur shadow-sm hover:bg-paper transition-colors lg:hidden"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      {/* Floating "My Bill" pill — shows only when past orders exist */}
      {placedOrders.length > 0 && (
        <button
          onClick={() => setIsBillOpen(true)}
          className="fixed top-3 right-4 z-40 flex items-center gap-1.5 bg-ink text-paper px-3.5 py-2 rounded-full shadow-lg hover:bg-ink/90 transition-all active:scale-95 motion-safe:animate-[slideDown_300ms_ease-out]"
          aria-label="View my bill"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="font-mono text-xs font-bold">My Bill</span>
          <span className="font-mono text-xs font-bold text-brass">₹{getGrandTotal()}</span>
        </button>
      )}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pb-24 relative pt-14 lg:pt-0">
        {/* Nav Sidebar / Topbar */}
        <div className="lg:w-48 shrink-0 lg:pr-4">
          <MenuCategoryNav
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 lg:px-8 lg:mt-6 overflow-hidden">
          {categories.map((category, index) => {
            const items = getItemsByCategory(category.id);

            // Full-bleed dark rhythm break before beverages
            const showRhythmBreak = category.id === 'beverages';

            return (
              <React.Fragment key={category.id}>
                {showRhythmBreak && (
                  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-16 bg-ink overflow-hidden">
                    <div className="relative py-16 px-4">
                      {/* Background image */}
                      <img
                        src="/images/restaurant-bar.jpg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                      <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="fraunces-display text-paper text-3xl md:text-4xl mb-3">
                          From Our Bar
                        </h2>
                        <p className="text-paper/60 font-body max-w-md mx-auto">
                          Signature cocktails and curated spirits to elevate your dining experience.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <section
                  id={category.id}
                  ref={(el) => { sectionRefs.current[index] = el; }}
                  className="mb-12 pt-6 lg:pt-0 scroll-mt-32"
                >
                  <div className="mb-6">
                    <h2 className="fraunces-heading text-2xl md:text-3xl text-charcoal-text">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-charcoal-text/50 text-sm mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <MenuBentoGrid
                    items={items}
                    onItemClick={handleItemClick}
                  />
                </section>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Item Detail Sheet */}
      <ItemDetailSheet
        itemId={selectedItemId}
        isOpen={selectedItemId !== null}
        onClose={handleCloseSheet}
      />

      {/* My Bill Sheet */}
      <MyBillSheet isOpen={isBillOpen} onClose={() => setIsBillOpen(false)} />
    </div>
  );
};
