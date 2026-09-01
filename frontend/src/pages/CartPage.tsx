import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, type CartItem } from '../store/useCartStore';
import { useSessionStore } from '../store/useSessionStore';
import { useGuestStore } from '../store/useGuestStore';
import { CartLineItem } from '../components/cart/CartLineItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { EditCustomizationSheet } from '../components/cart/EditCustomizationSheet';
import { guestApi } from '../lib/axios';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getTax, getTotal } = useCartStore();
  const { tableNumber, restaurantSlug, setOrder, addPlacedOrder } = useSessionStore();
  const { sessionToken } = useGuestStore();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const menuPath = restaurantSlug && tableNumber 
    ? `/r/${restaurantSlug}/t/${tableNumber}/menu` 
    : '/';
  
  const confirmPath = restaurantSlug && tableNumber
    ? `/r/${restaurantSlug}/t/${tableNumber}/order-confirmation`
    : '/';

  const handlePlaceOrder = async () => {
    if (placing || items.length === 0) return;
    setPlacing(true);
    setOrderError(null);

    try {
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations.map((c) => ({
          customizationId: c.customizationId,
          label: c.label,
          value: c.value,
          extraPrice: c.extraPrice,
        })),
        specialInstructions: item.specialInstructions,
      }));

      const res = await guestApi.post(
        '/orders',
        {
          tableNumber,
          restaurantSlug,
          items: orderItems,
          subtotal,
          tax,
          total,
          specialInstructions,
        },
        {
          headers: { 'x-guest-token': sessionToken ?? '' },
        }
      );

      const order = res.data.data;

      addPlacedOrder({
        orderId: order._id,
        items: [...items],
        subtotal,
        tax,
        total,
        placedAt: Date.now(),
      });

      setOrder(order._id);
      clearCart();
      navigate(confirmPath);
    } catch {
      setOrderError('Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };


  return (
    <>
    <div className="min-h-screen bg-linen pb-8 flex flex-col">
      {/* Ticket Header */}
      <div className="relative pt-10 px-4">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-2 left-4 text-charcoal-text/60 hover:text-charcoal-text p-2 flex items-center justify-center rounded-full bg-paper/50 hover:bg-paper transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
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
                <CartLineItem key={item.cartItemId} item={item} onEditClick={(item) => setEditingItem(item)} />
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
              {orderError && (
                <p className="text-wine text-sm text-center mb-3 animate-fade-in">{orderError}</p>
              )}
              <button 
                onClick={handlePlaceOrder}
                disabled={placing}
                className="bg-wine text-paper w-full py-4 rounded-[6px] font-body font-semibold text-lg hover:bg-wine/90 transition-colors min-h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? 'Placing order…' : `Place Order — ₹${total}`}
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

    {/* Edit Customization Sheet */}
    <EditCustomizationSheet
      cartItem={editingItem}
      isOpen={editingItem !== null}
      onClose={() => setEditingItem(null)}
    />
  </>
  );
};
