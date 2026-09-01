import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { useGuestStore } from '../store/useGuestStore';
import { StatusTracker } from '../components/ui/StatusTracker';
import { MyBillSheet } from '../components/cart/MyBillSheet';
import { useOrderSocket } from '../hooks/useOrderSocket';
import { guestApi } from '../lib/axios';

export const OrderConfirmationPage = () => {
  const { orderId, orderStatus, setOrderStatus, tableNumber, restaurantSlug } = useSessionStore();
  const { sessionToken } = useGuestStore();
  const [isBillOpen, setIsBillOpen] = useState(false);

  // Connect to socket — live status updates from admin
  useOrderSocket();

  // Fetch the latest order status on mount (in case of page refresh)
  useEffect(() => {
    if (!orderId || !tableNumber) return;

    const fetchLatestStatus = async () => {
      try {
        const res = await guestApi.get(`/orders/table/${tableNumber}`, {
          headers: { 'x-guest-token': sessionToken ?? '' },
        });
        const orders = res.data.data;
        // Find the current order and sync status
        const currentOrder = orders.find((o: any) => o._id === orderId);
        if (currentOrder && currentOrder.status !== orderStatus) {
          setOrderStatus(currentOrder.status);
        }
      } catch (error) {
        console.error('Failed to sync order status on mount', error);
      }
    };

    fetchLatestStatus();
  }, [orderId, tableNumber, sessionToken, orderStatus, setOrderStatus]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-linen relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)' }}></div>
      
      <div className="max-w-md w-full mx-auto px-4 z-10">
        <div className="bg-paper relative p-8 rounded-[6px] shadow-lg ticket-edge-top ticket-edge-bottom flex flex-col items-center text-center">
          
          <div className="bg-brass/10 text-brass w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">✓</span>
          </div>
          
          <h1 className="fraunces-display text-3xl text-charcoal-text mt-4">Order Placed!</h1>
          
          <div className="font-mono text-brass text-2xl font-bold tracking-wider mt-2">
            #{orderId?.slice(-6).toUpperCase() || 'TT-0042'}
          </div>
          
          <div className="font-mono text-charcoal-text/50 text-sm mt-1">
            Table {tableNumber || '12'}
          </div>
          
          <div className="w-full border-t border-dashed border-charcoal-text/15 my-6"></div>
          
          <div className="flex flex-col items-center w-full mb-6">
            <span className="font-body text-xs uppercase tracking-wider text-charcoal-text/40 mb-1">Estimated Time</span>
            <span className="font-mono text-charcoal-text text-lg">~20 minutes</span>
          </div>
          
          <div className="w-full mb-6 text-left">
            <StatusTracker status={orderStatus === 'idle' ? 'received' : orderStatus} />
          </div>
          
          <div className="w-full border-t border-dashed border-charcoal-text/15 my-6"></div>
          
          <Link 
            to={restaurantSlug && tableNumber ? `/r/${restaurantSlug}/t/${tableNumber}/menu` : '/'}
            className="bg-linen text-charcoal-text w-full py-3 rounded-[6px] font-body font-medium text-center block mb-3 hover:bg-linen/80 transition-colors"
          >
            Order More
          </Link>

          <button 
            onClick={() => setIsBillOpen(true)}
            disabled={orderStatus !== 'served'}
            className={`w-full py-3 rounded-[6px] font-body font-medium text-center block transition-colors ${
              orderStatus === 'served'
                ? 'bg-brass text-ink hover:bg-brass/90'
                : 'bg-brass/30 text-charcoal-text/50 cursor-not-allowed'
            }`}
          >
            {orderStatus === 'served' ? 'View Bill & Checkout' : 'Checkout (Wait for Order)'}
          </button>
          
          <p className="text-charcoal-text/40 text-xs text-center mt-6">
            Your waiter will bring your order to the table
          </p>
        </div>
      </div>
      <MyBillSheet isOpen={isBillOpen} onClose={() => setIsBillOpen(false)} />
    </div>
  );
};
