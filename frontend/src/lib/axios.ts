import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

/**
 * Admin API axios instance.
 *
 * - Attaches the current access token as a Bearer header on every request.
 * - On 401, silently calls /auth/refresh (which uses the httpOnly cookie)
 *   to get a new access token, then retries the original request once.
 * - If refresh fails, clears auth state and redirects to /admin/login.
 */
export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true, // send httpOnly refresh-token cookie
});

// ── Request interceptor — attach Bearer token ────────────────────────────────
adminApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ──────────────────────────────
let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pendingQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  pendingQueue = [];
};

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue subsequent 401s until refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(adminApi(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken: string = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Plain axios instance for guest-facing API calls (no auth header).
 * Attach x-guest-token manually where needed.
 */
export const guestApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: false,
});
