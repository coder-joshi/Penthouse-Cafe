import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { StatusTracker } from '../components/ui/StatusTracker';

export const OrderConfirmationPage = () => {
  const { orderId, orderStatus, tableNumber, restaurantSlug } = useSessionStore();

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
            #{orderId || 'TT-0042'}
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
            className="bg-linen text-charcoal-text w-full py-3 rounded-[6px] font-body font-medium text-center block"
          >
            Order More
          </Link>
          
          <p className="text-charcoal-text/40 text-xs text-center mt-4">
            Your waiter will bring your order to the table
          </p>
        </div>
      </div>
    </div>
  );
};
