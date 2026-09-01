import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useGuestStore } from '../store/useGuestStore';

/**
 * GuestGate — route guard for menu/cart/order-confirmation.
 *
 * Reads the persisted guest session from useGuestStore. If the guest is not
 * registered (no session token), redirects to the registration page for the
 * current table. Otherwise renders the child routes via <Outlet />.
 *
 * This is a real route-level guard (not just a UI toggle) — even a direct URL
 * hit to /menu will redirect to registration if the token is missing.
 */
export const GuestGate: React.FC = () => {
  const { restaurantSlug, tableNumber } = useParams<{
    restaurantSlug: string;
    tableNumber: string;
  }>();
  const isRegistered = useGuestStore((s) => s.isRegistered);
  const storedTable = useGuestStore((s) => s.tableNumber);
  const storedSlug = useGuestStore((s) => s.restaurantSlug);

  // Also check that the token is for this specific table
  // (prevents using a different table's token)
  const tokenMatchesTable =
    storedTable === tableNumber && storedSlug === restaurantSlug;

  if (!isRegistered || !tokenMatchesTable) {
    return (
      <Navigate
        to={`/r/${restaurantSlug}/t/${tableNumber}/register`}
        replace
      />
    );
  }

  return <Outlet />;
};
