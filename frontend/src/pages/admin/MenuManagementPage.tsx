import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/axios';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  spiceLevel: 0 | 1 | 2 | 3;
  image: string;
  tags: string[];
  restaurantSlug: string;
}

const CATEGORIES = [
  'chefs-specials', 'starters', 'mains-veg', 'mains-non-veg',
  'breads', 'desserts', 'beverages',
];

const empty: Omit<MenuItem, '_id'> = {
  name: '', description: '', price: 0, category: 'starters',
  isVeg: true, isFeatured: false, isAvailable: true, spiceLevel: 0,
  image: '', tags: [], restaurantSlug: 'penthouse-cafe',
};

export const MenuManagementPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, '_id'>>(empty);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<{ data: MenuItem[] }>('/menu?restaurantSlug=penthouse-cafe');
      setItems(res.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, price: item.price,
      category: item.category, isVeg: item.isVeg, isFeatured: item.isFeatured,
      isAvailable: item.isAvailable, spiceLevel: item.spiceLevel, image: item.image,
      tags: item.tags, restaurantSlug: item.restaurantSlug });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.put(`/menu/${editing._id}`, form);
      } else {
        await adminApi.post('/menu', form);
      }
      setShowForm(false);
      fetch();
    } catch { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await adminApi.delete(`/menu/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const handleToggle = async (item: MenuItem) => {
    await adminApi.patch(`/menu/${item._id}/toggle`);
    setItems((prev) =>
      prev.map((i) => i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i)
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Menu Management</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} items</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#C5A059] text-black text-sm font-semibold px-4 py-2 rounded-[6px] hover:bg-[#d4b070] transition-colors"
        >
          + New Item
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1e2b] border border-white/10 rounded-[8px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-white text-lg font-bold mb-5">{editing ? 'Edit Item' : 'New Item'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <FormField label="Name">
                <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputCls} placeholder="Item name" />
              </FormField>
              <FormField label="Description">
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${inputCls} h-20 resize-none`} placeholder="Description" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Price (₹)">
                  <input required type="number" min={0} value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className={inputCls} />
                </FormField>
                <FormField label="Category">
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Image URL">
                <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className={inputCls} placeholder="https://..." />
              </FormField>
              <FormField label="Tags (comma-separated)">
                <input value={form.tags.join(', ')}
                  onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
                  className={inputCls} placeholder="Bestseller, Signature" />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <ToggleField label="Veg" value={form.isVeg} onChange={(v) => setForm((p) => ({ ...p, isVeg: v }))} />
                <ToggleField label="Featured" value={form.isFeatured} onChange={(v) => setForm((p) => ({ ...p, isFeatured: v }))} />
                <ToggleField label="Available" value={form.isAvailable} onChange={(v) => setForm((p) => ({ ...p, isAvailable: v }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#C5A059] text-black font-semibold py-2.5 rounded-[6px] hover:bg-[#d4b070] transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-white/50 hover:text-white border border-white/10 rounded-[6px] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items list */}
      {loading ? (
        <p className="text-white/30 text-sm">Loading menu…</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id}
              className={`flex items-center gap-4 bg-[#1a1e2b] border rounded-[8px] px-5 py-4 transition-opacity ${
                item.isAvailable ? 'border-white/[0.07]' : 'border-white/[0.03] opacity-50'
              }`}>
              {item.image && (
                <img src={item.image} alt={item.name}
                  className="w-12 h-12 object-cover rounded-[4px] shrink-0 bg-white/5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  {item.isFeatured && <span className="text-[10px] text-[#C5A059] border border-[#C5A059]/40 px-1.5 rounded-full">Featured</span>}
                </div>
                <p className="text-white/40 text-xs mt-0.5">{item.category} · ₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(item)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    item.isAvailable
                      ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                      : 'border-white/10 text-white/30 hover:text-white/60'
                  }`}>
                  {item.isAvailable ? 'Available' : 'Off'}
                </button>
                <button onClick={() => openEdit(item)}
                  className="text-white/30 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button onClick={() => handleDelete(item._id)}
                  className="text-white/30 hover:text-red-400 p-1.5 rounded hover:bg-red-400/10 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-[4px] px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C5A059]/50 transition-colors';

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">{label}</label>
    {children}
  </div>
);

const ToggleField: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-2">
    <label className="text-white/40 text-xs uppercase tracking-wider">{label}</label>
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-[#C5A059]' : 'bg-white/20'}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);
