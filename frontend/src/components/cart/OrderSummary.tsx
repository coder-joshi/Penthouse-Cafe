import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, tax, total }) => {
  return (
    <div className="flex flex-col gap-2 mt-6">
      <div className="flex justify-between">
        <span className="font-body text-charcoal-text/70 text-sm">Subtotal</span>
        <span className="font-mono text-charcoal-text text-sm">₹{subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-body text-charcoal-text/70 text-sm">GST (5%)</span>
        <span className="font-mono text-charcoal-text text-sm">₹{tax}</span>
      </div>
      <div className="border-t border-charcoal-text/20 my-3"></div>
      <div className="flex justify-between items-center">
        <span className="font-body font-bold text-lg text-charcoal-text">Total</span>
        <span className="font-mono text-charcoal-text text-lg font-bold">₹{total}</span>
      </div>
    </div>
  );
};
