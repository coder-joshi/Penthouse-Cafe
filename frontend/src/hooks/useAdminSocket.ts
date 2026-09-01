import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { connectAsAdmin, disconnectSocket } from '../lib/socket';

export interface LiveOrder {
  _id: string;
  tableNumber: string;
  restaurantSlug: string;
  guest: {
    _id: string;
    name: string;
    tableNumber: string;
  };
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    customizations: Array<{ label: string; value: string; extraPrice: number }>;
    specialInstructions: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  specialInstructions: string;
  status: 'received' | 'preparing' | 'ready' | 'served';
  createdAt: string;
}

/**
 * useAdminSocket — connects to the admin room and accumulates incoming orders
 * in local state. Also handles status updates for orders already in the list.
 *
 * Mount this on the Admin Dashboard / LiveOrdersPage.
 */
export const useAdminSocket = (initialOrders: LiveOrder[] = []) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<LiveOrder[]>(initialOrders);

  // Allow parent to seed initial orders from HTTP fetch
  const seedOrders = useCallback((fetched: LiveOrder[]) => {
    setOrders(fetched);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const socket = connectAsAdmin(accessToken);

    // New order arrives — prepend to list
    socket.on('order:new', (order: LiveOrder) => {
      setOrders((prev) => [order, ...prev]);
    });

    // Status updated by another admin — sync in list
    socket.on('order:status', ({ orderId, status }: { orderId: string; status: LiveOrder['status'] }) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    });

    return () => {
      socket.off('order:new');
      socket.off('order:status');
      disconnectSocket();
    };
  }, [accessToken]);

  return { orders, setOrders, seedOrders };
};
