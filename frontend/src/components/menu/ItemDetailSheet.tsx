import React, { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { getItemById } from '../../data/menu';
import { VegIndicator } from '../ui/VegIndicator';
import { QuantityStepper } from '../ui/QuantityStepper';
import { triggerFlyToCart } from '../../utils/animationUtils';

interface ItemDetailSheetProps {
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({ itemId, isOpen, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeOpen, setActiveOpen] = useState(false);
  const [displayedItem, setDisplayedItem] = useState<any>(null);

  const item = useMemo(() => itemId ? getItemById(itemId) : null, [itemId]);

  // Sync state with isOpen prop to handle smooth animations
  useEffect(() => {
    if (isOpen && item) {
      setDisplayedItem(item);
      setQuantity(1);
      
      const initialCustomizations: Record<string, string[]> = {};
      item.customizations?.forEach(section => {
        if (section.type === 'radio' && section.options.length > 0) {
          initialCustomizations[section.id] = [section.options[0].id];
        } else {
          initialCustomizations[section.id] = [];
        }
      });
      setSelectedCustomizations(initialCustomizations);
      setIsAdded(false);
      
      // Trigger entrance transition next frame
      const timer = setTimeout(() => {
        setActiveOpen(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setActiveOpen(false);
      // Wait for exit transition to finish before unmounting content
      const timer = setTimeout(() => {
        setDisplayedItem(null);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, item]);

  if (!displayedItem) return null;

  const handleCustomizationChange = (sectionId: string, optionId: string, type: 'radio' | 'checkbox') => {
    setSelectedCustomizations(prev => {
      const current = prev[sectionId] || [];
      if (type === 'radio') {
        return { ...prev, [sectionId]: [optionId] };
      } else {
        if (current.includes(optionId)) {
          return { ...prev, [sectionId]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [sectionId]: [...current, optionId] };
        }
      }
    });
  };

  const selectedExtrasPrice = displayedItem.customizations?.reduce((total: number, section: any) => {
    const selectedIds = selectedCustomizations[section.id] || [];
    const sectionExtras = selectedIds.reduce((sum, optId) => {
      const option = section.options.find((o: any) => o.id === optId);
      return sum + (option?.extraPrice || 0);
    }, 0);
    return total + sectionExtras;
  }, 0) || 0;

  const totalPrice = (displayedItem.price + selectedExtrasPrice) * quantity;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Spawn flying item animation toward cart
    triggerFlyToCart(e, displayedItem.image);

    const customizationsToAdd: { customizationId: string; label: string; value: string; extraPrice: number }[] = [];
    
    if (displayedItem.customizations) {
      for (const section of displayedItem.customizations) {
        const selectedIds = selectedCustomizations[section.id] || [];
        for (const optId of selectedIds) {
          const option = section.options.find((o: any) => o.id === optId);
          if (option) {
            customizationsToAdd.push({
              customizationId: section.id,
              label: section.label,
              value: option.label,
              extraPrice: option.extraPrice || 0
            });
          }
        }
      }
    }

    addItem({
      id: displayedItem.id,
      name: displayedItem.name,
      price: displayedItem.price,
      image: displayedItem.image,
      isVeg: displayedItem.isVeg,
      customizations: customizationsToAdd,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 500);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-ink/50 z-50 pointer-events-auto transition-opacity duration-300 ${activeOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
        onClick={onClose}
      />
      
      {/* Mobile Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 max-h-[90vh] bg-paper rounded-t-2xl z-50 flex flex-col lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)] ${activeOpen ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom'}`}>
        <div className="w-12 h-1.5 bg-charcoal-text/20 rounded-full mx-auto mt-3 shrink-0" />
        <div className="overflow-y-auto flex-1 pb-24">
          <SheetContent 
            item={displayedItem} 
            selectedCustomizations={selectedCustomizations} 
            handleCustomizationChange={handleCustomizationChange}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-paper border-t border-charcoal-text/10">
          <button 
            onClick={handleAddToCart}
            className="bg-wine text-paper w-full py-4 rounded-[6px] font-body font-semibold text-lg hover:bg-wine/90 transition-colors active:scale-[0.98] duration-100"
          >
            {isAdded ? "✓ Added!" : `Add to Order — ₹${totalPrice}`}
          </button>
        </div>
      </div>

      {/* Desktop Panel */}
      <div className={`fixed top-0 right-0 h-full w-[480px] bg-paper z-50 shadow-2xl hidden lg:flex lg:flex-col ${activeOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
        <div className="overflow-y-auto flex-1 pb-24 relative">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-paper/90 p-2 rounded-full backdrop-blur min-w-[44px] min-h-[44px] hover:bg-linen/50 transition-colors flex items-center justify-center font-bold">
            ✕
          </button>
          <SheetContent 
            item={displayedItem} 
            selectedCustomizations={selectedCustomizations} 
            handleCustomizationChange={handleCustomizationChange}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
        <div className="p-4 bg-paper border-t border-charcoal-text/10 shrink-0">
          <button 
            onClick={handleAddToCart}
            className="bg-wine text-paper w-full py-4 rounded-[6px] font-body font-semibold text-lg hover:bg-wine/90 transition-colors active:scale-[0.98] duration-100"
          >
            {isAdded ? "✓ Added!" : `Add to Order — ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </>
  );
};

interface SheetContentProps {
  item: any;
  selectedCustomizations: Record<string, string[]>;
  handleCustomizationChange: (sectionId: string, optionId: string, type: 'radio' | 'checkbox') => void;
  quantity: number;
  setQuantity: (q: number) => void;
}

const SheetContent: React.FC<SheetContentProps> = ({ item, selectedCustomizations, handleCustomizationChange, quantity, setQuantity }) => {
  return (
    <>
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute top-12 left-4 lg:top-4 bg-paper/90 backdrop-blur rounded-[6px] p-1">
          <VegIndicator isVeg={item.isVeg} />
        </div>
      </div>
      
      <h2 className="fraunces-heading text-2xl text-charcoal-text mt-4 px-4">{item.name}</h2>
      
      <p className="text-charcoal-text/70 text-sm leading-relaxed px-4 mt-2">{item.description}</p>
      
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 mt-3">
          {item.tags.map((tag: string) => (
            <span key={tag} className="bg-sage/10 text-sage text-xs font-mono px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {(() => {
        const sortedCustomizations = [...(item.customizations || [])].sort((a: any, b: any) => {
          const getOrder = (label: string) => {
            const l = label.toLowerCase();
            if (l.includes('portion') || l.includes('size')) return 0;
            if (l.includes('spice')) return 1;
            return 2;
          };
          return getOrder(a.label) - getOrder(b.label);
        });

        return sortedCustomizations.map((section: any) => (
          <div key={section.id} className="mt-6">
          <h3 className="font-body font-semibold text-sm text-charcoal-text uppercase tracking-wider mb-3 px-4">
            {section.label}
          </h3>
          <div className="px-4 flex flex-col gap-2">
            {section.options.map((option: any) => {
              const isSelected = (selectedCustomizations[section.id] || []).includes(option.id);
              return (
                <div 
                  key={option.id}
                  onClick={() => handleCustomizationChange(section.id, option.id, section.type)}
                  className={`flex items-center justify-between min-h-[44px] px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'border-brass bg-brass/5 border' : 'bg-linen/50 border border-charcoal-text/10'} rounded-[6px]`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 flex items-center justify-center border ${isSelected ? 'border-brass bg-brass text-paper' : 'border-charcoal-text/20'} ${section.type === 'checkbox' ? 'rounded-[4px]' : 'rounded-full'}`}>
                      {isSelected && <span className="w-2.5 h-2.5 bg-paper rounded-full" />}
                    </div>
                    <span className="font-body text-charcoal-text text-sm">{option.label}</span>
                  </div>
                  {option.extraPrice > 0 && (
                    <span className="font-mono text-brass text-xs">+₹{option.extraPrice}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ));
      })()}

      <div className="mt-8 px-4 mb-4">
        <h3 className="font-body font-semibold text-sm text-charcoal-text uppercase tracking-wider mb-3">
          Quantity
        </h3>
        <QuantityStepper 
          quantity={quantity} 
          onIncrement={() => setQuantity(quantity + 1)}
          onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
        />
      </div>
    </>
  );
};
