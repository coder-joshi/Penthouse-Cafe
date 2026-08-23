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
  updateItemCustomizations: (oldCartItemId: string, newCustomizations: CartItemCustomization[]) => void;
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

      updateItemCustomizations: (oldCartItemId, newCustomizations) => {
        set((state) => {
          const oldItemIndex = state.items.findIndex(i => i.cartItemId === oldCartItemId);
          if (oldItemIndex === -1) return state;

          const oldItem = state.items[oldItemIndex];
          const newCartItemId = generateCartItemId(oldItem.id, newCustomizations);

          // Same customizations — just update in place
          if (newCartItemId === oldCartItemId) {
            const newItems = [...state.items];
            newItems[oldItemIndex] = { ...oldItem, customizations: newCustomizations };
            return { items: newItems };
          }

          // If new combo already exists in cart, merge quantities
          const existingTargetIndex = state.items.findIndex(i => i.cartItemId === newCartItemId);
          if (existingTargetIndex > -1) {
            const newItems = state.items.filter((_, idx) => idx !== oldItemIndex);
            const updatedTargetIndex = newItems.findIndex(i => i.cartItemId === newCartItemId);
            newItems[updatedTargetIndex] = {
              ...newItems[updatedTargetIndex],
              quantity: newItems[updatedTargetIndex].quantity + oldItem.quantity
            };
            return { items: newItems };
          }

          // Otherwise update in place with new ID
          const newItems = [...state.items];
          newItems[oldItemIndex] = { 
            ...oldItem, 
            cartItemId: newCartItemId, 
            customizations: newCustomizations 
          };
          return { items: newItems };
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
