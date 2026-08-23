import React from 'react';
import type { MenuItem } from '../../data/menu';
import { MenuItemCard } from './MenuItemCard';
import { MenuItemFeatured } from './MenuItemFeatured';

interface MenuBentoGridProps {
  items: MenuItem[];
  onItemClick: (id: string) => void;
}

export const MenuBentoGrid: React.FC<MenuBentoGridProps> = ({
  items,
  onItemClick,
}) => {
  if (!items.length) return null;

  const featuredItems = items.filter(item => item.isFeatured);
  const regularItems = items.filter(item => !item.isFeatured);

  // If no featured item, just show regular grid
  if (featuredItems.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={item.id} className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
            <MenuItemCard
              item={item}
              onItemClick={onItemClick}
            />
          </div>
        ))}
      </div>
    );
  }

  const mainFeatured = featuredItems[0];
  const restFeatured = featuredItems.slice(1);
  const allRegular = [...restFeatured, ...regularItems];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <MenuItemFeatured
          item={mainFeatured}
          onItemClick={onItemClick}
        />
      </div>
      
      {allRegular.map((item) => (
        <div key={item.id}>
          <MenuItemCard
            item={item}
            onItemClick={onItemClick}
          />
        </div>
      ))}
    </div>
  );
};
