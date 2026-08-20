import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuCategoryNav } from '../components/menu/MenuCategoryNav';
import { MenuBentoGrid } from '../components/menu/MenuBentoGrid';
import { ItemDetailSheet } from '../components/menu/ItemDetailSheet';
import { categories, getItemsByCategory, type MenuItem } from '../data/menu';
import { useCartStore } from '../store/useCartStore';

export const MenuPage: React.FC = () => {
  const { itemId: routeItemId } = useParams<{ 
    itemId?: string;
  }>();
  const { addItem } = useCartStore();
  
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

  const handleAddClick = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
      customizations: [],
    });
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pb-24 relative pt-14 lg:pt-0">
        {/* Nav Sidebar / Topbar */}
        <div className="lg:w-48 shrink-0">
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
            
            // Full-bleed dark rhythm break after 2nd category
            const showRhythmBreak = index === 2;

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
                    onAddClick={handleAddClick}
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
    </div>
  );
};
