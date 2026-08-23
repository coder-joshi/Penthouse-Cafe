import React, { useState, useEffect } from 'react';
import { useCartStore, type CartItem, type CartItemCustomization } from '../../store/useCartStore';
import { getItemById } from '../../data/menu';

interface EditCustomizationSheetProps {
  cartItem: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCustomizationSheet: React.FC<EditCustomizationSheetProps> = ({ cartItem, isOpen, onClose }) => {
  const updateItemCustomizations = useCartStore((state) => state.updateItemCustomizations);

  const [activeOpen, setActiveOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({});
  const [isSaved, setIsSaved] = useState(false);

  const menuItem = cartItem ? getItemById(cartItem.id) : null;

  useEffect(() => {
    if (isOpen && cartItem && menuItem) {
      setShouldRender(true);
      setIsSaved(false);

      // Pre-fill current selections from the cart item
      const initial: Record<string, string[]> = {};
      menuItem.customizations?.forEach((section) => {
        const matchingCartCustomizations = cartItem.customizations.filter(
          (c) => c.customizationId === section.id
        );
        if (matchingCartCustomizations.length > 0) {
          // Find the option IDs that match the cart values
          initial[section.id] = matchingCartCustomizations
            .map((cc) => {
              const option = section.options.find((o) => o.label === cc.value);
              return option?.id || '';
            })
            .filter(Boolean);
        } else if (section.type === 'radio' && section.options.length > 0) {
          initial[section.id] = [section.options[0].id];
        } else {
          initial[section.id] = [];
        }
      });
      setSelectedCustomizations(initial);

      const timer = setTimeout(() => setActiveOpen(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActiveOpen(false);
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cartItem, menuItem]);

  if (!shouldRender || !cartItem || !menuItem) return null;

  const handleCustomizationChange = (sectionId: string, optionId: string, type: 'radio' | 'checkbox') => {
    setSelectedCustomizations((prev) => {
      const current = prev[sectionId] || [];
      if (type === 'radio') {
        return { ...prev, [sectionId]: [optionId] };
      } else {
        if (current.includes(optionId)) {
          return { ...prev, [sectionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [sectionId]: [...current, optionId] };
        }
      }
    });
  };

  const handleSave = () => {
    const newCustomizations: CartItemCustomization[] = [];

    if (menuItem.customizations) {
      for (const section of menuItem.customizations) {
        const selectedIds = selectedCustomizations[section.id] || [];
        for (const optId of selectedIds) {
          const option = section.options.find((o) => o.id === optId);
          if (option) {
            newCustomizations.push({
              customizationId: section.id,
              label: section.label,
              value: option.label,
              extraPrice: option.extraPrice || 0,
            });
          }
        }
      }
    }

    updateItemCustomizations(cartItem.cartItemId, newCustomizations);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Helper to get the icon for a customization section
  const getSectionIcon = (sectionId: string) => {
    if (sectionId === 'spice-level') return '🌶️';
    if (sectionId === 'portion-size') return '📏';
    if (sectionId === 'drink-size') return '🥤';
    if (sectionId === 'bread-extras') return '🧈';
    return '⚙️';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-ink/50 z-50 transition-opacity duration-300 ${activeOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
        onClick={onClose}
      />

      {/* Mobile Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 max-h-[85dvh] bg-paper rounded-t-2xl z-50 flex flex-col lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)] ${activeOpen ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom'}`}>
        <div className="w-12 h-1.5 bg-charcoal-text/20 rounded-full mx-auto mt-3 shrink-0" />
        <div className="overflow-y-auto flex-1 pb-24">
          <SheetBody
            cartItem={cartItem}
            menuItem={menuItem}
            selectedCustomizations={selectedCustomizations}
            handleCustomizationChange={handleCustomizationChange}
            getSectionIcon={getSectionIcon}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-paper border-t border-charcoal-text/10">
          <button
            onClick={handleSave}
            className="bg-wine text-paper w-full py-3.5 rounded-[6px] font-body font-semibold text-base hover:bg-wine/90 transition-colors active:scale-[0.98] duration-100"
          >
            {isSaved ? '✓ Updated!' : 'Update Customizations'}
          </button>
        </div>
      </div>

      {/* Desktop Panel */}
      <div className={`fixed top-0 right-0 h-full w-[420px] bg-paper z-50 shadow-2xl hidden lg:flex lg:flex-col ${activeOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
        <div className="overflow-y-auto flex-1 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-paper/90 p-2 rounded-full backdrop-blur min-w-[44px] min-h-[44px] hover:bg-linen/50 transition-colors flex items-center justify-center font-bold"
          >
            ✕
          </button>
          <SheetBody
            cartItem={cartItem}
            menuItem={menuItem}
            selectedCustomizations={selectedCustomizations}
            handleCustomizationChange={handleCustomizationChange}
            getSectionIcon={getSectionIcon}
          />
        </div>
        <div className="p-4 bg-paper border-t border-charcoal-text/10 shrink-0">
          <button
            onClick={handleSave}
            className="bg-wine text-paper w-full py-3.5 rounded-[6px] font-body font-semibold text-base hover:bg-wine/90 transition-colors active:scale-[0.98] duration-100"
          >
            {isSaved ? '✓ Updated!' : 'Update Customizations'}
          </button>
        </div>
      </div>
    </>
  );
};

/* ---------- Sheet Body ---------- */

interface SheetBodyProps {
  cartItem: CartItem;
  menuItem: any;
  selectedCustomizations: Record<string, string[]>;
  handleCustomizationChange: (sectionId: string, optionId: string, type: 'radio' | 'checkbox') => void;
  getSectionIcon: (sectionId: string) => string;
}

const SheetBody: React.FC<SheetBodyProps> = ({
  cartItem,
  menuItem,
  selectedCustomizations,
  handleCustomizationChange,
  getSectionIcon,
}) => {
  return (
    <div className="px-4 pt-4">
      {/* Item Header */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={cartItem.image}
          alt={cartItem.name}
          className="w-16 h-16 rounded-[6px] object-cover shrink-0"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 ${cartItem.isVeg ? 'border-green-600' : 'border-red-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cartItem.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </span>
            <h3 className="fraunces-heading text-lg text-charcoal-text">{cartItem.name}</h3>
          </div>
          <p className="font-mono text-charcoal-text/50 text-xs mt-0.5">
            Qty: {cartItem.quantity} · ₹{cartItem.price}/each
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-charcoal-text/10 mb-4" />

      <h4 className="font-body font-semibold text-sm text-charcoal-text mb-4 uppercase tracking-wider">
        Edit Customizations
      </h4>

      {/* Customization Sections */}
      {menuItem.customizations?.map((section: any) => (
        <div key={section.id} className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-base">{getSectionIcon(section.id)}</span>
            <h5 className="font-body font-semibold text-sm text-charcoal-text">
              {section.label}
            </h5>
          </div>
          <div className="flex flex-col gap-2">
            {section.options.map((option: any) => {
              const isSelected = (selectedCustomizations[section.id] || []).includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => handleCustomizationChange(section.id, option.id, section.type)}
                  className={`flex items-center justify-between min-h-[44px] px-4 py-3 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-brass bg-brass/5 border shadow-sm'
                      : 'bg-linen/50 border border-charcoal-text/10 hover:border-charcoal-text/20'
                  } rounded-[6px]`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 flex items-center justify-center border transition-colors ${
                        isSelected ? 'border-brass bg-brass text-paper' : 'border-charcoal-text/20'
                      } ${section.type === 'checkbox' ? 'rounded-[4px]' : 'rounded-full'}`}
                    >
                      {isSelected && <span className="w-2.5 h-2.5 bg-paper rounded-full" />}
                    </div>
                    <span className="font-body text-charcoal-text text-sm">{option.label}</span>
                  </div>
                  {option.extraPrice > 0 && (
                    <span className="font-mono text-brass text-xs font-semibold">+₹{option.extraPrice}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
