import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RestaurantLayout } from './layouts/RestaurantLayout';
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TableNotFoundPage } from './pages/TableNotFoundPage';
import { MenuUnavailablePage } from './pages/MenuUnavailablePage';
import { GuestRegistrationPage } from './pages/GuestRegistrationPage';
import { GuestGate } from './components/GuestGate';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { LiveOrdersPage } from './pages/admin/LiveOrdersPage';
import { OrderHistoryPage } from './pages/admin/OrderHistoryPage';
import { MenuManagementPage } from './pages/admin/MenuManagementPage';
import { GuestListPage } from './pages/admin/GuestListPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';


export const router = createBrowserRouter([
  // ── Dev convenience redirect ──────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/r/penthouse-cafe/t/12" replace />,
  },

  // ── Restaurant guest routes ───────────────────────────────────────────────
  {
    path: '/r/:restaurantSlug/t/:tableNumber',
    element: <RestaurantLayout />,
    children: [
      // Landing page (splash) — no auth gate, visible to all
      {
        index: true,
        element: <LandingPage />,
      },
      // Guest registration — shown when no session token exists
      {
        path: 'register',
        element: <GuestRegistrationPage />,
      },
      // Gated routes — require completed guest registration
      {
        element: <GuestGate />,
        children: [
          {
            path: 'menu',
            element: <MenuPage />,
          },
          {
            path: 'menu/:itemId',
            element: <MenuPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'order-confirmation',
            element: <OrderConfirmationPage />,
          },
        ],
      },
    ],
  },

  // ── Admin routes ──────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminDashboardPage />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard/live" replace /> },
          { path: 'live', element: <LiveOrdersPage /> },
          { path: 'history', element: <OrderHistoryPage /> },
          { path: 'menu', element: <MenuManagementPage /> },
          { path: 'guests', element: <GuestListPage /> },
        ],
      },
    ],
  },

  // ── Utility routes ────────────────────────────────────────────────────────
  {
    path: '/not-found',
    element: <TableNotFoundPage />,
  },
  {
    path: '/unavailable',
    element: <MenuUnavailablePage />,
  },
  {
    path: '*',
    element: <TableNotFoundPage />,
  },
]);
