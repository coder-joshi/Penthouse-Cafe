import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../lib/axios';
import type { LiveOrder } from '../../hooks/useAdminSocket';

const STATUS_OPTIONS: Array<LiveOrder['status'] | 'all'> = ['all', 'received', 'preparing', 'ready', 'served'];

const statusPill: Record<LiveOrder['status'], string> = {
  received:  'bg-blue-500/15 text-blue-400',
  preparing: 'bg-amber-500/15 text-amber-400',
  ready:     'bg-emerald-500/15 text-emerald-400',
  served:    'bg-white/10 text-white/40',
};

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LiveOrder['status'] | 'all'>('all');
  const [tableFilter, setTableFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (tableFilter.trim()) params.set('tableNumber', tableFilter.trim());
      params.set('limit', '200');
      const res = await adminApi.get<{ data: LiveOrder[] }>(`/orders?${params}`);
      setOrders(res.data.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tableFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Order History</h1>
        <p className="text-white/40 text-sm mt-1">All orders across tables</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as LiveOrder['status'] | 'all')}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                statusFilter === s
                  ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#C5A059]'
                  : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {/* Table search */}
        <input
          type="text"
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          placeholder="Filter by table…"
          className="bg-white/5 border border-white/10 rounded-[6px] px-3 py-1.5 text-white text-xs placeholder-white/25 focus:outline-none focus:border-[#C5A059]/50 w-36"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-white/30 text-sm">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-white/30 text-sm">No orders found.</div>
      ) : (
        <div className="bg-[#1a1e2b] border border-white/[0.07] rounded-[8px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Table</th>
                <th className="text-left px-5 py-3">Guest</th>
                <th className="text-left px-5 py-3">Items</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">T{order.tableNumber}</td>
                  <td className="px-5 py-3.5 text-white/60">{order.guest?.name ?? '—'}</td>
                  <td className="px-5 py-3.5 text-white/60">
                    {order.items.map((it) => `${it.quantity}× ${it.name}`).join(', ')}
                  </td>
                  <td className="px-5 py-3.5 text-white text-right">₹{order.total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusPill[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
