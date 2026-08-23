import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from './useCartStore';

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  placedAt: number; // timestamp
}

interface SessionState {
  restaurantSlug: string | null;
  tableNumber: string | null;
  orderId: string | null;
  orderStatus: 'idle' | 'received' | 'preparing' | 'served';
  placedOrders: PlacedOrder[];
  isBillSettled: boolean;
  paymentMethod: 'upi' | 'card' | 'cash' | null;
  tipAmount: number;
  settledAt: number | null;

  setSession: (slug: string, table: string) => void;
  setOrder: (orderId: string) => void;
  setOrderStatus: (status: 'idle' | 'received' | 'preparing' | 'served') => void;
  addPlacedOrder: (order: PlacedOrder) => void;
  getGrandTotal: () => number;
  getTotalOrderedItems: () => number;
  getGrandSubtotal: () => number;
  getGrandTax: () => number;
  settleBill: (paymentMethod: 'upi' | 'card' | 'cash', tipAmount: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      tableNumber: null,
      orderId: null,
      orderStatus: 'idle',
      placedOrders: [],
      isBillSettled: false,
      paymentMethod: null,
      tipAmount: 0,
      settledAt: null,

      setSession: (slug, table) =>
        set({ restaurantSlug: slug, tableNumber: table }),

      setOrder: (orderId) =>
        set({ orderId, orderStatus: 'received' }),

      setOrderStatus: (status) =>
        set({ orderStatus: status }),

      addPlacedOrder: (order) =>
        set((state) => ({
          placedOrders: [...state.placedOrders, order],
        })),

      getGrandSubtotal: () => {
        return get().placedOrders.reduce((sum, order) => sum + order.subtotal, 0);
      },

      getGrandTax: () => {
        return get().placedOrders.reduce((sum, order) => sum + order.tax, 0);
      },

      getGrandTotal: () => {
        return get().placedOrders.reduce((sum, order) => sum + order.total, 0);
      },

      getTotalOrderedItems: () => {
        return get().placedOrders.reduce(
          (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
          0
        );
      },

      settleBill: (method, tip) =>
        set({
          isBillSettled: true,
          paymentMethod: method,
          tipAmount: tip,
          settledAt: Date.now(),
        }),

      clearSession: () =>
        set({
          restaurantSlug: null,
          tableNumber: null,
          orderId: null,
          orderStatus: 'idle',
          placedOrders: [],
          isBillSettled: false,
          paymentMethod: null,
          tipAmount: 0,
          settledAt: null,
        }),
    }),
    {
      name: 'tt-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
