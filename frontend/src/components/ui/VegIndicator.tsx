import React from 'react';

interface VegIndicatorProps {
  isVeg: boolean;
  size?: 'sm' | 'md';
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const innerSizeClasses = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const colorClasses = isVeg ? 'border-green-600' : 'border-red-600';
  const innerColorClasses = isVeg ? 'bg-green-600' : 'bg-red-600';

  return (
    <div 
      className={`flex items-center justify-center border ${colorClasses} ${sizeClasses} rounded-[2px]`}
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <div className={`rounded-full ${innerColorClasses} ${innerSizeClasses}`} />
    </div>
  );
};
