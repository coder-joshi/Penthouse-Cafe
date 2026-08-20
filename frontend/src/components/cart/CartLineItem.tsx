import React from 'react';
import { QuantityStepper } from '../ui/QuantityStepper';
import { useCartStore } from '../../store/useCartStore';
import type { CartItem } from '../../store/useCartStore';

interface CartLineItemProps {
  item: CartItem;
}

export const CartLineItem: React.FC<CartLineItemProps> = ({ item }) => {
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const lineTotal = (item.price + (item.customizations?.reduce((sum: number, c) => sum + c.extraPrice, 0) || 0)) * (item.quantity || 1);

  return (
    <div className="flex items-center justify-between border-b border-dashed border-charcoal-text/10 pb-4 mb-4">
      <div className="flex items-center gap-4 flex-1">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[4px] object-cover shrink-0" />
        )}
        <div className="flex flex-col">
          <span className="font-body font-medium text-sm text-charcoal-text">{item.name}</span>
          {item.customizations && item.customizations.length > 0 && (
            <span className="text-xs text-charcoal-text/50 font-mono mt-0.5">
              {item.customizations.map((c) => c.value).join(', ')}
            </span>
          )}
          <span className="font-mono text-wine text-sm mt-1">₹{item.price}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
        <QuantityStepper 
          quantity={item.quantity || 1} 
          onIncrement={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          onDecrement={() => updateQuantity(item.cartItemId, item.quantity - 1)}
          size="sm"
        />
        <span className="font-mono text-charcoal-text text-sm font-semibold">₹{lineTotal}</span>
      </div>
    </div>
  );
};
