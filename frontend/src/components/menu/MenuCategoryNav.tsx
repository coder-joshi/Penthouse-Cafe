import React from 'react';
import type { MenuCategory } from '../../data/menu';
import { CategoryChip } from '../ui/CategoryChip';

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
  return (
    <>
      {/* Mobile Nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-linen/95 backdrop-blur-sm px-4 py-3 border-b border-charcoal-text/10">
        <div className="flex overflow-x-auto hide-scrollbar category-scroll gap-2">
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
      <div className="hidden lg:flex lg:sticky lg:top-4 lg:w-48 lg:flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`text-left py-2 px-3 transition-colors ${
              activeCategoryId === cat.id
                ? 'border-l-2 border-brass text-brass font-semibold'
                : 'text-charcoal-text/70 hover:text-charcoal-text'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );
};
