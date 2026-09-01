import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGuestStore } from '../store/useGuestStore';

interface FormData {
  name: string;
  email: string;
  phone: string;
  isCouple: boolean;
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  isCouple: false,
  partnerName: '',
  partnerEmail: '',
  partnerPhone: '',
};

export const GuestRegistrationPage: React.FC = () => {
  const { restaurantSlug, tableNumber } = useParams<{
    restaurantSlug: string;
    tableNumber: string;
  }>();
  const navigate = useNavigate();
  const { registerGuest } = useGuestStore();

  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantSlug || !tableNumber) return;
    setLoading(true);
    setError(null);
    try {
      await registerGuest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        tableNumber,
        restaurantSlug,
        isCouple: form.isCouple,
        partnerName: form.isCouple ? form.partnerName.trim() : undefined,
        partnerEmail: form.isCouple ? form.partnerEmail.trim() : undefined,
        partnerPhone: form.isCouple ? form.partnerPhone.trim() : undefined,
      });
      // On success the GuestGate will allow through — navigate to menu
      navigate(`/r/${restaurantSlug}/t/${tableNumber}/menu`, { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-ink flex flex-col items-center relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("/images/restaurant-interior-2.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-navy/90" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logo-window.png"
          alt=""
          className="h-[70vh] object-contain opacity-[0.04] invert"
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="h-10 bg-gold shrink-0"
              style={{
                aspectRatio: '1024/935',
                maskImage: 'url(/logo-window.png)',
                WebkitMaskImage: 'url(/logo-window.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
            <div className="flex flex-col items-start">
              <span className="text-cream tracking-widest text-sm font-display uppercase">
                The Penthouse
              </span>
              <span className="text-gold tracking-[0.2em] text-[9px] uppercase">
                At Home Sweet Home
              </span>
            </div>
          </div>
          <div className="inline-block border border-gold/40 text-gold px-4 py-1 text-xs uppercase tracking-widest mb-4">
            Table {tableNumber}
          </div>
          <h1 className="font-display text-3xl text-cream mb-2">Welcome in</h1>
          <p className="text-cream/50 text-sm font-body leading-relaxed">
            Let us know who you are before we begin.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-cream/[0.05] backdrop-blur-md border border-white/10 rounded-[6px] p-6 space-y-4"
        >
          {/* Your Details */}
          <fieldset className="space-y-3">
            <legend className="text-gold text-xs uppercase tracking-widest mb-3 block">
              Your Details
            </legend>
            <GuestInput
              label="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            <GuestInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            <GuestInput
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </fieldset>

          {/* Couple Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-white/10">
            <span className="text-cream/80 text-sm font-body">Are you a couple?</span>
            <button
              type="button"
              id="couple-toggle"
              role="switch"
              aria-checked={form.isCouple}
              onClick={() => setForm((p) => ({ ...p, isCouple: !p.isCouple }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                form.isCouple ? 'bg-gold' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  form.isCouple ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Partner Details */}
          {form.isCouple && (
            <fieldset className="space-y-3 animate-fade-in">
              <legend className="text-gold text-xs uppercase tracking-widest mb-3 block">
                Partner's Details
              </legend>
              <GuestInput
                label="Partner's Name"
                name="partnerName"
                type="text"
                value={form.partnerName}
                onChange={handleChange}
                placeholder="Partner's full name"
                required
              />
              <GuestInput
                label="Partner's Email"
                name="partnerEmail"
                type="email"
                value={form.partnerEmail}
                onChange={handleChange}
                placeholder="partner@email.com"
                required
              />
              <GuestInput
                label="Partner's Phone"
                name="partnerPhone"
                type="tel"
                value={form.partnerPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </fieldset>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="guest-register-submit"
            disabled={loading}
            className="w-full border border-gold text-gold py-3.5 uppercase tracking-widest text-sm font-semibold hover:bg-gold hover:text-navy transition-all duration-300 rounded-[6px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Seating you…' : 'Begin Dining →'}
          </button>

          <p className="text-cream/30 text-[11px] text-center leading-relaxed">
            Your details are only used to personalise your experience and may be used for future offers.
          </p>
        </form>
      </div>
    </div>
  );
};

// ── Helper: consistent input field ───────────────────────────────────────────
interface GuestInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const GuestInput: React.FC<GuestInputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-cream/60 text-xs uppercase tracking-wider">{label}</label>
    <input
      {...props}
      className="bg-white/5 border border-white/15 rounded-[4px] px-3 py-2.5 text-cream placeholder-cream/25 text-sm font-body focus:outline-none focus:border-gold/60 transition-colors"
    />
  </div>
);
