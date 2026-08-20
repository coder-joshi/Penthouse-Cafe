import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { TableConfirmation } from '../components/landing/TableConfirmation';
import { restaurant } from '../data/restaurant';

export const LandingPage: React.FC = () => {
  const { restaurantSlug, tableNumber } = useParams<{ restaurantSlug: string; tableNumber: string }>();
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    if (restaurantSlug && tableNumber) {
      setSession(restaurantSlug, tableNumber);
    }
  }, [restaurantSlug, tableNumber, setSession]);

  const displayTableNumber = tableNumber || '?';

  const handleViewMenu = () => {
    if (restaurantSlug && tableNumber) {
      navigate(`/r/${restaurantSlug}/t/${tableNumber}/menu`);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-linen px-4 py-8 md:px-8">
      {/* Top Section */}
      <div className="text-center mt-4">
        <h1 className="fraunces-display text-4xl md:text-5xl text-charcoal-text mb-2">
          {restaurant.name}
        </h1>
        <p className="font-body text-charcoal-text/60 italic mb-2">
          {restaurant.tagline}
        </p>
        <p className="text-sage font-body text-sm tracking-wide uppercase">
          {restaurant.cuisine}
        </p>
      </div>

      {/* Middle Section — Table Confirmation */}
      <div className="my-6 flex justify-center">
        <TableConfirmation tableNumber={displayTableNumber} />
      </div>

      {/* Hero Bento Section — using actual venue photos */}
      <div className="-mx-2 mb-8 flex-1 flex flex-col justify-center max-h-[50vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full">
          {/* Large image — restaurant interior with flower ceiling */}
          <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-[6px] overflow-visible min-h-[220px]">
            <div className="absolute inset-0 -right-3 rounded-[6px] overflow-hidden">
              <img 
                src="/images/restaurant-interior-1.jpg"
                alt="Restaurant interior with vintage decor" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent flex items-end p-4 md:p-6">
                <div>
                  <p className="text-paper/60 font-mono text-xs uppercase tracking-widest mb-1">Today's Special</p>
                  <h2 className="font-display text-paper text-xl md:text-2xl fraunces-heading">
                    Dal Makhani
                  </h2>
                  <p className="font-mono text-brass text-sm mt-1">₹345</p>
                </div>
              </div>
            </div>
          </div>
          {/* Smaller image — wide interior shot */}
          <div className="col-span-1 row-span-1 rounded-[6px] overflow-hidden min-h-[105px]">
            <img 
              src="/images/restaurant-interior-2.jpg"
              alt="Dining area with flower ceiling" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Smaller image — bar area */}
          <div className="col-span-1 row-span-1 rounded-[6px] overflow-hidden min-h-[105px]">
            <img 
              src="/images/restaurant-bar.jpg"
              alt="Bar with arched shelving" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section (Thumb Zone) */}
      <div className="mt-auto w-full pb-4">
        <button 
          onClick={handleViewMenu}
          className="bg-wine text-paper w-full max-w-sm mx-auto block py-4 px-8 font-body font-semibold text-lg rounded-[6px] hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wine"
        >
          View Menu
        </button>
        <p className="text-charcoal-text/40 text-xs text-center mt-3 font-body">
          Browse • Add • Order — no app needed
        </p>
      </div>
    </div>
  );
};
