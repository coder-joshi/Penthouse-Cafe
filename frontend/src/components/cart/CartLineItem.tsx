import React from 'react';
import { QuantityStepper } from '../ui/QuantityStepper';
import { useCartStore } from '../../store/useCartStore';
import type { CartItem } from '../../store/useCartStore';

interface CartLineItemProps {
  item: CartItem;
  onEditClick?: (item: CartItem) => void;
}

// Helper to pick an icon for a customization type
function getChipIcon(customizationId: string): string {
  if (customizationId === 'spice-level') return '🌶️';
  if (customizationId === 'portion-size') return '📏';
  if (customizationId === 'drink-size') return '🥤';
  if (customizationId === 'bread-extras') return '🧈';
  if (customizationId === 'lime-style') return '🍋';
  return '';
}

export const CartLineItem: React.FC<CartLineItemProps> = ({ item, onEditClick }) => {
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const lineTotal = (item.price + (item.customizations?.reduce((sum: number, c) => sum + c.extraPrice, 0) || 0)) * (item.quantity || 1);

  const hasCustomizations = item.customizations && item.customizations.length > 0;

  return (
    <div className="flex items-center justify-between border-b border-dashed border-charcoal-text/10 pb-4 mb-4">
      <div className="flex items-start gap-3 flex-1">
        {/* Tappable image area */}
        {item.image && (
          <button
            onClick={() => onEditClick?.(item)}
            className="relative group shrink-0 cursor-pointer"
            aria-label={`Edit ${item.name} customizations`}
          >
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-[6px] object-cover" />
            {/* Edit overlay hint */}
            {hasCustomizations && (
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 rounded-[6px] flex items-center justify-center transition-all">
                <span className="opacity-0 group-hover:opacity-100 text-paper text-xs font-mono font-bold transition-opacity">
                  ✏️
                </span>
              </div>
            )}
          </button>
        )}
        <div className="flex flex-col min-w-0">
          <button
            onClick={() => onEditClick?.(item)}
            className="text-left cursor-pointer hover:text-wine transition-colors"
          >
            <span className="font-body font-medium text-sm text-charcoal-text">{item.name}</span>
          </button>

          {/* Styled customization chips */}
          {hasCustomizations && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.customizations.map((c) => (
                <span
                  key={`${c.customizationId}-${c.value}`}
                  className="inline-flex items-center gap-0.5 bg-linen text-charcoal-text/70 text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-charcoal-text/8"
                >
                  <span>{getChipIcon(c.customizationId)}</span>
                  <span>{c.value}</span>
                  {c.extraPrice > 0 && <span className="text-brass">+₹{c.extraPrice}</span>}
                </span>
              ))}
            </div>
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
