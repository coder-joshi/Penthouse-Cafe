import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemCustomization {
  customizationId: string;
  label: string;
  value: string;
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string; // unique per cart entry (item + customization combo)
  id: string;         // menu item id
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  customizations: CartItemCustomization[];
  specialInstructions: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId' | 'quantity' | 'specialInstructions'>, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateSpecialInstructions: (cartItemId: string, instructions: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTax: () => number;
  getTotal: () => number;
  // animation trigger
  lastAddedTimestamp: number;
}

function generateCartItemId(itemId: string, customizations: CartItemCustomization[]): string {
  const customKey = customizations
    .map((c) => `${c.customizationId}:${c.value}`)
    .sort()
    .join('|');
  return `${itemId}__${customKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedTimestamp: 0,

      addItem: (item, quantity = 1) => {
        const cartItemId = generateCartItemId(item.id, item.customizations);

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.cartItemId === cartItemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems, lastAddedTimestamp: Date.now() };
          }

          return {
            items: [
              ...state.items,
              { ...item, cartItemId, quantity, specialInstructions: '' },
            ],
            lastAddedTimestamp: Date.now(),
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.cartItemId !== cartItemId) };
          }
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      updateSpecialInstructions: (cartItemId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const customExtra = item.customizations.reduce((sum, c) => sum + c.extraPrice, 0);
          return total + (item.price + customExtra) * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTax: () => {
        return Math.round(get().getSubtotal() * 0.05); // 5% GST
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },
    }),
    {
      name: 'tt-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
