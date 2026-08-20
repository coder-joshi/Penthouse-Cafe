import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RestaurantLayout } from './layouts/RestaurantLayout';
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TableNotFoundPage } from './pages/TableNotFoundPage';
import { MenuUnavailablePage } from './pages/MenuUnavailablePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/r/tandoori-trails/t/12" replace />,
  },
  {
    path: '/r/:restaurantSlug/t/:tableNumber',
    element: <RestaurantLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
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
