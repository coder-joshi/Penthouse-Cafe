import { useEffect } from 'react';
import { useSessionStore } from '../store/useSessionStore';
import { useGuestStore } from '../store/useGuestStore';
import { connectAsGuest, disconnectSocket } from '../lib/socket';

/**
 * useOrderSocket — connects a guest to their table room and listens for
 * real-time order status updates from the admin.
 *
 * Mount this once on the OrderConfirmationPage. It automatically disconnects
 * when the component unmounts.
 *
 * Event: `order:status` → { orderId, status }
 */
export const useOrderSocket = () => {
  const tableNumber = useGuestStore((s) => s.tableNumber);
  const setOrderStatus = useSessionStore((s) => s.setOrderStatus);

  useEffect(() => {
    if (!tableNumber) return;

    const socket = connectAsGuest(tableNumber);

    socket.on('order:status', ({ status }: { orderId: string; status: 'received' | 'preparing' | 'ready' | 'served' }) => {
      setOrderStatus(status);
    });

    return () => {
      socket.off('order:status');
      disconnectSocket();
    };
  }, [tableNumber, setOrderStatus]);
};
