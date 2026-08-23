import React from 'react';
import type { MenuCategory } from '../../data/menu';
import { CategoryChip } from '../ui/CategoryChip';
import { useParams, Link } from 'react-router-dom';

interface MenuCategoryNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onCategoryClick: (id: string) => void;
}

export const MenuCategoryNav: React.FC<MenuCategoryNavProps> = ({
  categories,
  activeCategoryId,
  onCategoryClick,
}) => {
  const { restaurantId = 'tandoori-trails', tableId = '12' } = useParams();
  return (
    <>
      {/* Mobile Nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-linen/95 backdrop-blur-sm px-4 py-3 border-b border-charcoal-text/10">
        <div className="flex overflow-x-auto hide-scrollbar category-scroll gap-2">
          <Link to={`/r/${restaurantId}/t/${tableId}`} className="shrink-0">
            <CategoryChip
              label="Home"
              isActive={false}
              onClick={() => {}}
            />
          </Link>
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              isActive={activeCategoryId === cat.id}
              onClick={() => onCategoryClick(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex lg:sticky lg:top-14 lg:w-48 lg:flex-col gap-2 pb-4 border-r-4 border-wine/30 pr-4">
        <Link 
          to={`/r/${restaurantId}/t/${tableId}`}
          className="text-left py-2 px-3 transition-colors text-charcoal-text hover:text-charcoal-text border-l-4 border-transparent font-bold"
        >
          Home
        </Link>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`text-left py-2 px-3 transition-colors border-l-4 ${
              activeCategoryId === cat.id
                ? 'border-wine text-wine font-semibold bg-wine/15'
                : 'border-transparent text-charcoal-text/70 hover:text-charcoal-text'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );
};
