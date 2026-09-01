import React, { useEffect } from 'react';
import { adminApi } from '../../lib/axios';
import { useAdminSocket, type LiveOrder } from '../../hooks/useAdminSocket';

const statusColors: Record<LiveOrder['status'], string> = {
  received:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  preparing: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ready:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  served:    'bg-white/10 text-white/40 border-white/10',
};

const nextStatus: Partial<Record<LiveOrder['status'], LiveOrder['status']>> = {
  received:  'preparing',
  preparing: 'ready',
  ready:     'served',
};

const nextLabel: Partial<Record<LiveOrder['status'], string>> = {
  received:  'Mark Preparing',
  preparing: 'Mark Ready',
  ready:     'Mark Served',
};

export const LiveOrdersPage: React.FC = () => {
  const { orders, setOrders, seedOrders } = useAdminSocket([]);

  // Load recent orders on mount (not just socket events)
  useEffect(() => {
    adminApi
      .get<{ data: LiveOrder[] }>('/orders?limit=50')
      .then((res) => seedOrders(res.data.data))
      .catch(() => {/* ignore — socket will populate */});
  }, [seedOrders]);

  const handleStatusChange = async (order: LiveOrder) => {
    const next = nextStatus[order.status];
    if (!next) return;
    try {
      await adminApi.patch(`/orders/${order._id}/status`, { status: next });
      // Optimistic update — socket event will also sync
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: next } : o))
      );
    } catch {
      alert('Failed to update order status');
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'served');
  const servedOrders = orders.filter((o) => o.status === 'served');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Live Orders</h1>
          <p className="text-white/40 text-sm mt-1">Real-time incoming orders</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm">Live</span>
        </div>
      </div>

      {/* Empty state */}
      {activeOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-white/30 text-sm">No active orders right now.</p>
          <p className="text-white/20 text-xs mt-1">New orders will appear here instantly.</p>
        </div>
      )}

      {/* Active order cards */}
      <div className="space-y-4 mb-10">
        {activeOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onAction={() => handleStatusChange(order)}
          />
        ))}
      </div>

      {/* Served orders */}
      {servedOrders.length > 0 && (
        <>
          <h2 className="text-white/30 text-xs uppercase tracking-widest mb-4">Recently Served</h2>
          <div className="space-y-3 opacity-50">
            {servedOrders.slice(0, 5).map((order) => (
              <OrderCard key={order._id} order={order} onAction={() => {}} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Order card ─────────────────────────────────────────────────────────────────
interface OrderCardProps {
  order: LiveOrder;
  onAction: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAction }) => {
  const next = nextStatus[order.status];

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-[#1a1e2b] border border-white/[0.07] rounded-[8px] p-5">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold">Table {order.tableNumber}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-sm">{order.guest?.name ?? 'Guest'}</span>
          </div>
          <span className="text-white/30 text-xs">{timeAgo(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs border px-2.5 py-1 rounded-full uppercase tracking-wider font-medium ${statusColors[order.status]}`}>
            {order.status}
          </span>
          {next && (
            <button
              onClick={onAction}
              className="bg-[#C5A059] text-black text-xs font-semibold px-3 py-1.5 rounded-[4px] hover:bg-[#d4b070] transition-colors whitespace-nowrap"
            >
              {nextLabel[order.status]}
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <div>
              <span className="text-white/80">{item.quantity}× {item.name}</span>
              {item.customizations?.length > 0 && (
                <span className="text-white/30 text-xs ml-2">
                  ({item.customizations.map((c) => c.value).join(', ')})
                </span>
              )}
              {item.specialInstructions && (
                <p className="text-white/30 text-xs mt-0.5 italic">"{item.specialInstructions}"</p>
              )}
            </div>
            <span className="text-white/50 shrink-0 ml-4">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Special instructions */}
      {order.specialInstructions && (
        <p className="text-white/30 text-xs border-t border-white/[0.06] pt-3 italic">
          Note: {order.specialInstructions}
        </p>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06] mt-3">
        <span className="text-white/30 text-xs">Total</span>
        <span className="text-white font-semibold">₹{order.total}</span>
      </div>
    </div>
  );
};
