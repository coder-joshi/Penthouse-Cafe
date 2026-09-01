import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.post('/auth/login', { email, password });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url("/images/restaurant-interior-2.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-ink to-navy/90" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="/logo-window.png" alt="" className="h-[60vh] opacity-[0.03] invert" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-9 bg-gold shrink-0"
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
                Staff Portal
              </span>
            </div>
          </div>
          <h1 className="font-display text-2xl text-cream">Admin Access</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[6px] p-6 space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-cream/60 text-xs uppercase tracking-wider">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@penthouse.in"
              required
              autoComplete="email"
              className="bg-white/5 border border-white/15 rounded-[4px] px-3 py-2.5 text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-cream/60 text-xs uppercase tracking-wider">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="bg-white/5 border border-white/15 rounded-[4px] px-3 py-2.5 text-cream placeholder-cream/25 text-sm focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full border border-gold text-gold py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gold hover:text-navy transition-all duration-300 rounded-[6px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-cream/20 text-xs text-center mt-6">
          Restricted access — staff only
        </p>
      </div>
    </div>
  );
};
