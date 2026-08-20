import React from 'react';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, isActive, onClick }) => {
  const baseClasses = 'whitespace-nowrap px-4 py-2 font-body text-sm font-medium rounded-full transition-colors duration-150 min-h-[44px] flex items-center justify-center';
  const activeClasses = 'bg-brass text-paper border border-brass';
  const inactiveClasses = 'bg-paper text-charcoal-text border border-charcoal-text/15 hover:bg-linen';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};
