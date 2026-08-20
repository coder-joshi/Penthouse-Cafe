import React from 'react';
import type { MenuItem } from '../../data/menu';
import { useCartStore } from '../../store/useCartStore';
import { VegIndicator } from '../ui/VegIndicator';

interface MenuItemFeaturedProps {
  item: MenuItem;
  onItemClick: (id: string) => void;
  onAddClick: (item: MenuItem) => void;
}

export const MenuItemFeatured: React.FC<MenuItemFeaturedProps> = ({
  item,
  onItemClick,
  onAddClick,
}) => {
  const { items: cartItems } = useCartStore();
  const cartItem = cartItems.find((c) => c.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddClick(item);
  };

  return (
    <div
      onClick={() => onItemClick(item.id)}
      className="relative w-full rounded-[6px] overflow-hidden cursor-pointer group h-full"
    >
      <div className="h-[250px] md:h-[300px] w-full">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-sage/20" />
        )}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      {/* Veg Indicator */}
      <div className="absolute top-4 left-4 bg-paper/90 rounded-full p-1">
        <VegIndicator isVeg={item.isVeg} />
      </div>

      {/* Tag */}
      {item.tags && item.tags.length > 0 && (
        <div className="absolute top-4 right-4 bg-brass text-paper text-xs font-mono uppercase px-3 py-1 rounded-[6px]">
          {item.tags[0]}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex justify-between items-end">
        <div className="flex flex-col pr-4 w-3/4">
          <span className="font-mono text-brass text-lg mb-1">
            ₹{item.price}
          </span>
          <h3 className="font-display text-paper text-xl md:text-2xl mb-1 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-paper/70 text-sm line-clamp-2 font-body">
            {item.description}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          {quantity === 0 && (
            <button
              onClick={handleAdd}
              className="bg-wine text-paper w-11 h-11 rounded-[6px] flex items-center justify-center text-2xl font-medium shadow-sm hover:bg-wine/90 transition-colors"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
