import React from 'react';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const btnClasses = `flex items-center justify-center bg-linen hover:bg-brass/10 border border-charcoal-text/10 rounded-[6px] transition-colors min-w-[44px] min-h-[44px] ${
    isSm ? 'text-lg' : 'text-xl'
  }`;

  return (
    <div className="flex items-center space-x-3">
      <button 
        onClick={onDecrement} 
        className={btnClasses}
        aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
      >
        {quantity === 1 ? '✕' : '−'}
      </button>
      <span className="font-mono text-charcoal-text font-medium min-w-[20px] text-center">
        {quantity}
      </span>
      <button 
        onClick={onIncrement} 
        className={btnClasses}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
