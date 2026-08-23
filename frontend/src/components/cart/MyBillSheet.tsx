import React, { useState, useEffect } from 'react';
import { useSessionStore, type PlacedOrder } from '../../store/useSessionStore';
import { useCartStore } from '../../store/useCartStore';
import { CheckoutModal } from './CheckoutModal';

interface MyBillSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBillSheet: React.FC<MyBillSheetProps> = ({ isOpen, onClose }) => {
  const { placedOrders, tableNumber, getGrandSubtotal, getGrandTax, getGrandTotal, getTotalOrderedItems } = useSessionStore();
  const { items: activeCartItems, getSubtotal: getCartSubtotal, getTax: getCartTax, getTotal: getCartTotal, getTotalItems: getCartTotalItems } = useCartStore();

  const [activeOpen, setActiveOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setActiveOpen(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActiveOpen(false);
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset drag state when completely closed
  useEffect(() => {
    if (!activeOpen) {
      setDragOffset(0);
    }
  }, [activeOpen]);

  if (!shouldRender) return null;

  const pastSubtotal = getGrandSubtotal();
  const pastTax = getGrandTax();
  const pastTotal = getGrandTotal();
  const pastItemCount = getTotalOrderedItems();

  const cartSubtotal = getCartSubtotal();
  const cartTax = getCartTax();
  const cartTotal = getCartTotal();
  const cartItemCount = getCartTotalItems();

  const combinedSubtotal = pastSubtotal + cartSubtotal;
  const combinedTax = pastTax + cartTax;
  const combinedTotal = pastTotal + cartTotal;
  const combinedItemCount = pastItemCount + cartItemCount;

  const hasPlacedOrders = placedOrders.length > 0;
  const hasActiveCart = activeCartItems.length > 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchStartY(e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (touchStartY === null) return;
    const currentY = e.clientY;
    const offset = Math.max(0, currentY - touchStartY);
    setDragOffset(offset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragOffset > 70) {
      onClose();
    } else {
      setDragOffset(0);
    }
    setTouchStartY(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-ink/50 z-50 transition-opacity duration-300 ${activeOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
        onClick={onClose}
        style={{ opacity: activeOpen ? 1 - Math.min(dragOffset / 300, 1) : undefined }}
      />

      {/* Mobile Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 max-h-[85dvh] bg-paper rounded-t-2xl z-50 flex flex-col lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)] ${activeOpen && touchStartY === null ? 'animate-slide-in-bottom transition-transform duration-300' : ''} ${!isOpen ? 'animate-slide-out-bottom' : ''}`}
        style={{ transform: isOpen && dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined }}
      >
        <div 
          className="w-full pt-4 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-12 h-1.5 bg-charcoal-text/20 rounded-full mx-auto shrink-0" />
        </div>
        <div className="overflow-y-auto flex-1 pb-6">
          <BillContent
            placedOrders={placedOrders}
            activeCartItems={activeCartItems}
            tableNumber={tableNumber}
            pastSubtotal={pastSubtotal}
            pastTotal={pastTotal}
            pastItemCount={pastItemCount}
            cartSubtotal={cartSubtotal}
            cartTax={cartTax}
            cartTotal={cartTotal}
            cartItemCount={cartItemCount}
            combinedSubtotal={combinedSubtotal}
            combinedTax={combinedTax}
            combinedTotal={combinedTotal}
            combinedItemCount={combinedItemCount}
            hasPlacedOrders={hasPlacedOrders}
            hasActiveCart={hasActiveCart}
            onClose={onClose}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      {/* Desktop Panel */}
      <div className={`fixed top-0 right-0 h-full w-[480px] bg-paper z-50 shadow-2xl hidden lg:flex lg:flex-col ${activeOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
        <div className="overflow-y-auto flex-1 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-paper/90 p-2 rounded-full backdrop-blur min-w-[44px] min-h-[44px] hover:bg-linen/50 transition-colors flex items-center justify-center font-bold"
          >
            ✕
          </button>
          <BillContent
            placedOrders={placedOrders}
            activeCartItems={activeCartItems}
            tableNumber={tableNumber}
            pastSubtotal={pastSubtotal}
            pastTotal={pastTotal}
            pastItemCount={pastItemCount}
            cartSubtotal={cartSubtotal}
            cartTax={cartTax}
            cartTotal={cartTotal}
            cartItemCount={cartItemCount}
            combinedSubtotal={combinedSubtotal}
            combinedTax={combinedTax}
            combinedTotal={combinedTotal}
            combinedItemCount={combinedItemCount}
            hasPlacedOrders={hasPlacedOrders}
            hasActiveCart={hasActiveCart}
            onClose={onClose}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

/* ---------- Bill Content ---------- */

interface BillContentProps {
  placedOrders: PlacedOrder[];
  activeCartItems: import('../../store/useCartStore').CartItem[];
  tableNumber: string | null;
  pastSubtotal: number;
  pastTotal: number;
  pastItemCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  combinedSubtotal: number;
  combinedTax: number;
  combinedTotal: number;
  combinedItemCount: number;
  hasPlacedOrders: boolean;
  hasActiveCart: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const BillContent: React.FC<BillContentProps> = ({
  placedOrders,
  activeCartItems,
  tableNumber,
  pastSubtotal,
  combinedSubtotal,
  combinedTax,
  combinedTotal,
  combinedItemCount,
  hasPlacedOrders,
  hasActiveCart,
  onCheckout,
}) => {
  return (
    <div className="px-4 pt-4 pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-wine/10 text-wine px-3 py-1 rounded-full text-xs font-mono mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Table {tableNumber || '?'}
        </div>
        <h2 className="fraunces-heading text-2xl text-charcoal-text">My Bill</h2>
        <p className="font-mono text-charcoal-text/50 text-xs mt-1">
          {combinedItemCount} item{combinedItemCount !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Past Orders */}
      {hasPlacedOrders && (
        <div className="mb-6">
          {placedOrders.map((order, index) => (
            <OrderBlock key={order.orderId} order={order} index={index} />
          ))}
        </div>
      )}

      {/* Active Cart Items (not yet placed) */}
      {hasActiveCart && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <h3 className="font-mono text-sm font-bold text-charcoal-text uppercase tracking-wider">
              In Your Cart
            </h3>
            <span className="font-mono text-xs text-charcoal-text/40">(not yet placed)</span>
          </div>
          <div className="bg-sage/5 border border-sage/20 rounded-[6px] p-3">
            {activeCartItems.map((item) => {
              const itemTotal = (item.price + item.customizations.reduce((s, c) => s + c.extraPrice, 0)) * item.quantity;
              return (
                <div key={item.cartItemId} className="flex justify-between items-start py-1.5">
                  <div className="flex-1 pr-2">
                    <span className="font-mono text-xs text-charcoal-text">
                      {item.quantity}× {item.name}
                    </span>
                    {item.customizations.length > 0 && (
                      <div className="text-[10px] text-charcoal-text/50 font-mono mt-0.5">
                        {item.customizations.map((c) => `${c.label}: ${c.value}`).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-xs text-charcoal-text">₹{itemTotal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasPlacedOrders && !hasActiveCart && (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="fraunces-heading text-lg text-charcoal-text mb-1">No orders yet</h3>
          <p className="font-body text-charcoal-text/50 text-sm">Items you order will appear here.</p>
        </div>
      )}

      {/* Grand Total Section */}
      {(hasPlacedOrders || hasActiveCart) && (
        <div className="bg-ink rounded-[6px] p-4 mt-2">
          {/* Past orders subtotal */}
          {hasPlacedOrders && (
            <div className="flex justify-between mb-1.5">
              <span className="font-body text-paper/60 text-sm">Placed Orders</span>
              <span className="font-mono text-paper/80 text-sm">₹{pastSubtotal}</span>
            </div>
          )}
          {/* Active cart subtotal */}
          {hasActiveCart && (
            <div className="flex justify-between mb-1.5">
              <span className="font-body text-paper/60 text-sm">Current Cart</span>
              <span className="font-mono text-paper/80 text-sm">₹{activeCartItems.reduce((sum, item) => sum + (item.price + item.customizations.reduce((s, c) => s + c.extraPrice, 0)) * item.quantity, 0)}</span>
            </div>
          )}
          <div className="border-t border-paper/15 my-2" />
          <div className="flex justify-between mb-1">
            <span className="font-body text-paper/60 text-sm">Subtotal</span>
            <span className="font-mono text-paper/80 text-sm">₹{combinedSubtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-body text-paper/60 text-sm">GST (5%)</span>
            <span className="font-mono text-paper/80 text-sm">₹{combinedTax}</span>
          </div>
          <div className="border-t border-paper/20 my-2" />
          <div className="flex justify-between items-center">
            <span className="fraunces-heading text-lg text-paper">Grand Total</span>
            <span className="fraunces-heading text-2xl text-brass">₹{combinedTotal}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full mt-4 bg-brass text-ink py-3.5 rounded-[6px] font-body font-bold text-lg hover:bg-brass/90 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Order Block ---------- */

interface OrderBlockProps {
  order: PlacedOrder;
  index: number;
}

const OrderBlock: React.FC<OrderBlockProps> = ({ order, index }) => {
  const time = new Date(order.placedAt);
  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-brass/15 text-brass font-mono text-xs font-bold px-2 py-0.5 rounded-full">
            Order #{index + 1}
          </span>
          <span className="font-mono text-[10px] text-charcoal-text/40">{order.orderId}</span>
        </div>
        <span className="font-mono text-xs text-charcoal-text/40">{timeStr}</span>
      </div>
      <div className="bg-paper border border-charcoal-text/8 rounded-[6px] p-3 shadow-sm">
        {order.items.map((item) => {
          const itemTotal = (item.price + item.customizations.reduce((s, c) => s + c.extraPrice, 0)) * item.quantity;
          return (
            <div key={item.cartItemId} className="flex justify-between items-start py-1.5">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </span>
                  <span className="font-mono text-xs text-charcoal-text font-medium">
                    {item.quantity}× {item.name}
                  </span>
                </div>
                {item.customizations.length > 0 && (
                  <div className="text-[10px] text-charcoal-text/50 font-mono mt-0.5 ml-[18px]">
                    {item.customizations.map((c) => `${c.label}: ${c.value}`).join(', ')}
                  </div>
                )}
              </div>
              <span className="font-mono text-xs text-charcoal-text/70">₹{itemTotal}</span>
            </div>
          );
        })}
        <div className="border-t border-dashed border-charcoal-text/10 mt-2 pt-2 flex justify-between">
          <span className="font-mono text-xs text-charcoal-text/50">
            {order.items.reduce((s, i) => s + i.quantity, 0)} items
          </span>
          <span className="font-mono text-xs font-bold text-charcoal-text">₹{order.total}</span>
        </div>
      </div>
    </div>
  );
};
