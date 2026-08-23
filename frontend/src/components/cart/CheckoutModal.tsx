import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../store/useSessionStore';
import { useCartStore } from '../../store/useCartStore';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { tableNumber, getGrandTotal, settleBill, isBillSettled, paymentMethod, tipAmount, clearSession } = useSessionStore();
  
  // Also consider active cart items if they are checking out everything at once
  const { items: cartItems, getTotal: getCartTotal, clearCart } = useCartStore();

  const [activeOpen, setActiveOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cash' | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

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

  if (!shouldRender) return null;

  const baseTotal = getGrandTotal() + getCartTotal();
  const finalTotal = baseTotal + selectedTip;

  const hasUnplacedItems = cartItems.length > 0;

  const handlePay = () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // If there are unplaced items, conceptually they are being ordered & paid for now.
      // In a real app, we'd hit an API to finalize the order.
      // Here, we just clear the active cart and settle.
      if (hasUnplacedItems) {
        clearCart();
      }
      
      settleBill(selectedPayment, selectedTip);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCloseSession = () => {
    clearSession();
    clearCart();
    navigate('/');
    onClose();
  };

  // If already settled, show Receipt
  if (isBillSettled) {
    return (
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${activeOpen ? 'opacity-100 bg-ink/70' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-paper w-full max-w-md rounded-xl shadow-2xl overflow-hidden ticket-edge-top ticket-edge-bottom flex flex-col transform transition-transform duration-300 scale-100">
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2 className="fraunces-heading text-2xl text-charcoal-text mb-1">Payment Successful</h2>
            <p className="font-mono text-charcoal-text/50 text-sm mb-6">Table {tableNumber}</p>
            
            <div className="w-full border-t border-dashed border-charcoal-text/15 my-4"></div>
            
            <div className="w-full space-y-2 text-sm font-mono text-left mb-6">
              <div className="flex justify-between">
                <span className="text-charcoal-text/60">Amount Paid</span>
                <span className="font-bold text-charcoal-text">₹{baseTotal + tipAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-text/60">Payment Method</span>
                <span className="uppercase text-charcoal-text">{paymentMethod}</span>
              </div>
            </div>

            <p className="font-body text-charcoal-text/60 text-sm mb-8">
              Thank you for dining at Tandoori Trails! We hope to see you again soon.
            </p>

            <button
              onClick={handleCloseSession}
              className="w-full bg-wine text-paper py-3.5 rounded-[6px] font-body font-semibold hover:bg-wine/90 transition-colors"
            >
              Start New Session
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 text-charcoal-text/60 font-body font-medium text-sm hover:text-charcoal-text transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 transition-opacity duration-300 ${activeOpen ? 'opacity-100 bg-ink/70' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className={`bg-paper w-full max-w-md sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col relative max-h-[85dvh] transition-transform duration-300 ${activeOpen ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-charcoal-text/10 shrink-0">
          <h2 className="fraunces-heading text-xl text-charcoal-text">Checkout</h2>
          <button 
            onClick={onClose}
            className="p-2 text-charcoal-text/50 hover:text-charcoal-text transition-colors rounded-full hover:bg-linen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          
          {hasUnplacedItems && (
            <div className="bg-brass/10 border border-brass/30 rounded-[6px] p-3 mb-5 flex gap-3 items-start">
              <span className="text-lg">⚠️</span>
              <p className="text-xs font-body text-charcoal-text/80 leading-relaxed">
                You have unplaced items in your cart. Checking out now will include them in your final bill.
              </p>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-linen rounded-[6px] p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body text-charcoal-text/70 text-sm">Total Bill</span>
              <span className="font-mono text-charcoal-text text-sm">₹{baseTotal}</span>
            </div>
            
            {/* Tip Selection */}
            <div className="mt-4 pt-4 border-t border-charcoal-text/10">
              <span className="font-body font-medium text-sm text-charcoal-text block mb-3">Add a Tip (Optional)</span>
              <div className="flex gap-2">
                {[0, 30, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedTip(amount)}
                    className={`flex-1 py-2 text-sm font-mono rounded-[6px] transition-colors border ${
                      selectedTip === amount 
                        ? 'bg-brass text-paper border-brass font-bold' 
                        : 'bg-paper text-charcoal-text/70 border-charcoal-text/15 hover:border-brass/50'
                    }`}
                  >
                    {amount === 0 ? 'None' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-5">
              <span className="fraunces-heading text-lg text-charcoal-text">Amount to Pay</span>
              <span className="fraunces-heading text-2xl text-wine">₹{finalTotal}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <h3 className="font-body font-semibold text-sm text-charcoal-text mb-3">Select Payment Method</h3>
          
          <div className="space-y-3">
            {/* UPI Option */}
            <button
              onClick={() => setSelectedPayment('upi')}
              className={`w-full flex items-center gap-4 p-4 rounded-[6px] border text-left transition-all ${
                selectedPayment === 'upi' ? 'border-brass bg-brass/5 shadow-sm' : 'border-charcoal-text/15 bg-paper hover:border-brass/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <span className="text-xl">📱</span>
              </div>
              <div className="flex-1">
                <h4 className="font-body font-semibold text-charcoal-text">Pay via UPI</h4>
                <p className="font-body text-xs text-charcoal-text/60 mt-0.5">Google Pay, PhonePe, Paytm</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'upi' ? 'border-brass' : 'border-charcoal-text/20'}`}>
                {selectedPayment === 'upi' && <div className="w-2.5 h-2.5 bg-brass rounded-full" />}
              </div>
            </button>
            
            {/* UPI QR Display (Conditional) */}
            {selectedPayment === 'upi' && (
              <div className="bg-white border border-charcoal-text/10 rounded-[6px] p-4 flex flex-col items-center mx-4 mb-2 -mt-1 animate-fade-in">
                <div className="w-32 h-32 bg-gray-100 border border-gray-200 flex items-center justify-center mb-2">
                  {/* Fake QR Code */}
                  <div className="grid grid-cols-5 gap-1 w-24 h-24">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`bg-charcoal-text ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                  </div>
                </div>
                <p className="font-mono text-xs text-charcoal-text/50">Scan to pay ₹{finalTotal}</p>
              </div>
            )}

            {/* Card Option */}
            <button
              onClick={() => setSelectedPayment('card')}
              className={`w-full flex items-center gap-4 p-4 rounded-[6px] border text-left transition-all ${
                selectedPayment === 'card' ? 'border-brass bg-brass/5 shadow-sm' : 'border-charcoal-text/15 bg-paper hover:border-brass/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <span className="text-xl">💳</span>
              </div>
              <div className="flex-1">
                <h4 className="font-body font-semibold text-charcoal-text">Card at Table</h4>
                <p className="font-body text-xs text-charcoal-text/60 mt-0.5">Server will bring the machine</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'card' ? 'border-brass' : 'border-charcoal-text/20'}`}>
                {selectedPayment === 'card' && <div className="w-2.5 h-2.5 bg-brass rounded-full" />}
              </div>
            </button>

            {/* Cash Option */}
            <button
              onClick={() => setSelectedPayment('cash')}
              className={`w-full flex items-center gap-4 p-4 rounded-[6px] border text-left transition-all ${
                selectedPayment === 'cash' ? 'border-brass bg-brass/5 shadow-sm' : 'border-charcoal-text/15 bg-paper hover:border-brass/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <span className="text-xl">💵</span>
              </div>
              <div className="flex-1">
                <h4 className="font-body font-semibold text-charcoal-text">Cash</h4>
                <p className="font-body text-xs text-charcoal-text/60 mt-0.5">Server will collect payment</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'cash' ? 'border-brass' : 'border-charcoal-text/20'}`}>
                {selectedPayment === 'cash' && <div className="w-2.5 h-2.5 bg-brass rounded-full" />}
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-charcoal-text/10 shrink-0 bg-paper sm:rounded-b-xl">
          <button
            onClick={handlePay}
            disabled={!selectedPayment || isProcessing}
            className="w-full bg-wine text-paper py-3.5 rounded-[6px] font-body font-semibold text-lg hover:bg-wine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              `Pay ₹${finalTotal}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
