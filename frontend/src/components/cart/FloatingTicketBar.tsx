import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useSessionStore } from '../../store/useSessionStore';

export const FloatingTicketBar = () => {
  const navigate = useNavigate();
  const { items, getTotalItems, getSubtotal, lastAddedTimestamp } = useCartStore();
  const { restaurantSlug, tableNumber } = useSessionStore();
  
  const [isPulsing, setIsPulsing] = useState(false);
  
  const totalItems = getTotalItems();
  const totalPrice = getSubtotal();

  useEffect(() => {
    if (lastAddedTimestamp) {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp]);

  if (totalItems === 0) return null;

  const handleNavigate = () => {
    if (restaurantSlug && tableNumber) {
      navigate(`/r/${restaurantSlug}/t/${tableNumber}/cart`);
    } else {
      navigate('/cart');
    }
  };

  return (
    <>
      {/* Mobile Floating Ticket Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 motion-safe:animate-[slideUp_300ms_ease-out]">
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <div className="mx-3 mb-3">
          <button 
            onClick={handleNavigate}
            className={`w-full bg-paper relative shadow-lg rounded-[6px] ticket-edge-top motion-safe:hover:rotate-[-0.3deg] transition-transform ${isPulsing ? 'scale-[1.03]' : ''} border-l-4 border-wine`}
          >
            <div className="px-4 py-3 flex items-center justify-between text-left">
              <div>
                <div className="font-mono text-charcoal-text text-sm">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
                <div className="font-mono text-wine font-bold text-lg">₹{totalPrice.toFixed(2)}</div>
              </div>
              <div className="font-mono text-brass text-sm font-semibold flex items-center">
                View Order <span className="ml-1">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Floating Ticket Bar */}
      <div className="hidden lg:block fixed right-4 top-20 z-40 motion-safe:animate-[slideLeft_300ms_ease-out] w-80">
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
        <div className={`bg-paper relative shadow-xl rounded-[6px] ticket-edge-top border-l-4 border-wine flex flex-col max-h-[calc(100dvh-160px)] transition-transform ${isPulsing ? 'scale-[1.03]' : ''}`}>
          <div className="p-4 border-b border-dashed border-charcoal-text/15">
            <h3 className="fraunces-heading text-lg text-charcoal-text">Current Order</h3>
          </div>
          
          <div className="p-4 overflow-y-auto hide-scrollbar flex-1">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <span className="font-mono text-xs text-charcoal-text font-semibold">{item.quantity}x {item.name}</span>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-[10px] text-charcoal-text/50 font-mono mt-1 space-y-0.5">
                        {item.customizations.map(c => (
                          <div key={c.customizationId}>+ {c.label}: {c.value}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-xs text-charcoal-text mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-linen/50 border-t border-dashed border-charcoal-text/15 mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-sm font-medium text-charcoal-text">Subtotal</span>
              <span className="font-mono font-bold text-wine">₹{totalPrice.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleNavigate}
              className="w-full bg-brass text-paper py-2.5 rounded-[6px] font-mono text-sm font-bold uppercase tracking-wider"
            >
              View Full Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
