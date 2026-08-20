import React from 'react';
import type { MenuItem } from '../../data/menu';
import { useCartStore } from '../../store/useCartStore';
import { QuantityStepper } from '../ui/QuantityStepper';
import { VegIndicator } from '../ui/VegIndicator';

interface MenuItemCardProps {
  item: MenuItem;
  onItemClick: (id: string) => void;
  onAddClick: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onItemClick,
  onAddClick,
}) => {
  const { items: cartItems, updateQuantity, removeItem } = useCartStore();
  const cartItem = cartItems.find((c) => c.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddClick(item);
  };

  const handleIncrease = () => {
    if (cartItem) updateQuantity(cartItem.cartItemId, quantity + 1);
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (quantity > 1) {
        updateQuantity(cartItem.cartItemId, quantity - 1);
      } else {
        removeItem(cartItem.cartItemId);
      }
    }
  };

  return (
    <div
      onClick={() => onItemClick(item.id)}
      className="flex flex-row md:flex-col gap-4 p-4 rounded-[6px] bg-paper shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full"
    >
      <div className="shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 md:w-full md:h-40 rounded-[6px] object-cover"
          />
        ) : (
          <div className="w-20 h-20 md:w-full md:h-40 rounded-[6px] bg-sage/10" />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-body font-semibold text-charcoal-text truncate">
              {item.name}
            </h3>
            <VegIndicator isVeg={item.isVeg} />
          </div>
        </div>

        <p className="text-sm text-charcoal-text/60 line-clamp-2 mt-1">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-sage/10 text-sage text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-mono text-wine font-semibold">
            ₹{item.price}
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            {quantity > 0 ? (
              <QuantityStepper
                quantity={quantity}
                onIncrement={handleIncrease}
                onDecrement={handleDecrease}
                size="sm"
              />
            ) : (
              <button
                onClick={handleAdd}
                className="bg-wine/10 text-wine font-semibold px-4 py-2 rounded-[6px] text-sm min-w-[44px] min-h-[44px]"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
