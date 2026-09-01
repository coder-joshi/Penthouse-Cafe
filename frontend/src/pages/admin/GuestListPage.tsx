import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/axios';

interface Guest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  tableNumber: string;
  restaurantSlug: string;
  isCouple: boolean;
  partnerName?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  createdAt: string;
}

export const GuestListPage: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi
      .get<{ data: Guest[] }>('/guests?limit=500')
      .then((res) => setGuests(res.data.data))
      .catch(() => {/* silent */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.tableNumber.includes(search)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Guest List</h1>
          <p className="text-white/40 text-sm mt-1">{guests.length} registered guests</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or table…"
          className="bg-white/5 border border-white/10 rounded-[6px] px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C5A059]/50 w-64"
        />
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/30 text-sm">No guests found.</p>
      ) : (
        <div className="bg-[#1a1e2b] border border-white/[0.07] rounded-[8px] overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.07] text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Contact</th>
                <th className="text-left px-5 py-3">Table</th>
                <th className="text-center px-5 py-3">Couple</th>
                <th className="text-left px-5 py-3">Partner</th>
                <th className="text-left px-5 py-3">Visited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((guest) => (
                <tr key={guest._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{guest.name}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-white/70 text-xs">{guest.email}</p>
                    <p className="text-white/40 text-xs">{guest.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">T{guest.tableNumber}</td>
                  <td className="px-5 py-3.5 text-center">
                    {guest.isCouple ? (
                      <span className="text-pink-400 text-lg">♥</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {guest.isCouple && guest.partnerName ? (
                      <div>
                        <p className="text-white/70 text-xs">{guest.partnerName}</p>
                        <p className="text-white/30 text-xs">{guest.partnerEmail}</p>
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-xs whitespace-nowrap">
                    {new Date(guest.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
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
