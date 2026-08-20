import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useSessionStore } from '../store/useSessionStore';
import { CartLineItem } from '../components/cart/CartLineItem';
import { OrderSummary } from '../components/cart/OrderSummary';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getTax, getTotal } = useCartStore();
  const { tableNumber, restaurantSlug, setOrder } = useSessionStore();
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const menuPath = restaurantSlug && tableNumber 
    ? `/r/${restaurantSlug}/t/${tableNumber}/menu` 
    : '/';
  
  const confirmPath = restaurantSlug && tableNumber
    ? `/r/${restaurantSlug}/t/${tableNumber}/order-confirmation`
    : '/';

  const handlePlaceOrder = () => {
    const orderId = `TT-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrder(orderId);
    clearCart();
    navigate(confirmPath);
  };

  return (
    <div className="min-h-screen bg-linen pb-8 flex flex-col">
      {/* Ticket Header */}
      <div className="relative pt-10 px-4">
        <div className="bg-paper relative p-6 rounded-[6px] shadow-sm ticket-edge-top ticket-edge-bottom text-center">
          <h1 className="fraunces-heading text-2xl text-charcoal-text">Your Order</h1>
          <p className="font-mono text-brass text-sm mt-1">Table {tableNumber || '?'}</p>
          <p className="font-mono text-charcoal-text/50 text-xs mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 mt-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="fraunces-heading text-xl text-charcoal-text mb-2">Your order is empty</h2>
            <Link to={menuPath} className="font-body text-wine underline text-sm">
              Browse the menu to add items
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-paper rounded-[6px] p-4 shadow-sm border border-charcoal-text/5">
              {items.map((item) => (
                <CartLineItem key={item.cartItemId} item={item} />
              ))}

              <textarea 
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full mt-4 border-dashed border-2 border-charcoal-text/15 rounded-[6px] bg-paper p-4 font-body text-sm resize-none h-24 focus:outline-none focus:border-brass/50 transition-colors"
                placeholder="Any special requests? Allergies?"
              />

              <div className="mt-4">
                <OrderSummary subtotal={subtotal} tax={tax} total={total} />
              </div>
            </div>

            {/* Place Order CTA — Thumb zone */}
            <div className="mt-4 pb-4">
              <button 
                onClick={handlePlaceOrder}
                className="bg-wine text-paper w-full py-4 rounded-[6px] font-body font-semibold text-lg hover:bg-wine/90 transition-colors min-h-[52px]"
              >
                Place Order — ₹{total}
              </button>
              
              <div className="text-center mt-3">
                <Link to={menuPath} className="text-charcoal-text/50 text-sm hover:text-charcoal-text transition-colors">
                  ← Back to menu
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
