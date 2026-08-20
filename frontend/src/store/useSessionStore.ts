import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SessionState {
  restaurantSlug: string | null;
  tableNumber: string | null;
  orderId: string | null;
  orderStatus: 'idle' | 'received' | 'preparing' | 'served';
  setSession: (slug: string, table: string) => void;
  setOrder: (orderId: string) => void;
  setOrderStatus: (status: 'idle' | 'received' | 'preparing' | 'served') => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      restaurantSlug: null,
      tableNumber: null,
      orderId: null,
      orderStatus: 'idle',

      setSession: (slug, table) =>
        set({ restaurantSlug: slug, tableNumber: table }),

      setOrder: (orderId) =>
        set({ orderId, orderStatus: 'received' }),

      setOrderStatus: (status) =>
        set({ orderStatus: status }),

      clearSession: () =>
        set({
          restaurantSlug: null,
          tableNumber: null,
          orderId: null,
          orderStatus: 'idle',
        }),
    }),
    {
      name: 'tt-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
