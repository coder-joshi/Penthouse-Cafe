import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface GuestInfo {
  guestId: string;
  guestName: string;
  tableNumber: string;
  restaurantSlug: string;
  sessionToken: string; // raw token stored client-side, sent as x-guest-token
}

interface GuestState extends Partial<GuestInfo> {
  isRegistered: boolean;

  /** Call the backend to register a guest and persist the session token. */
  registerGuest: (payload: {
    name: string;
    email: string;
    phone: string;
    tableNumber: string;
    restaurantSlug: string;
    isCouple: boolean;
    partnerName?: string;
    partnerEmail?: string;
    partnerPhone?: string;
  }) => Promise<void>;

  clearGuest: () => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      isRegistered: false,
      guestId: undefined,
      guestName: undefined,
      tableNumber: undefined,
      restaurantSlug: undefined,
      sessionToken: undefined,

      registerGuest: async (payload) => {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/api/v1/guests/register`,
          payload,
          { withCredentials: true }
        );
        const data = response.data.data as GuestInfo;
        set({
          isRegistered: true,
          guestId: data.guestId,
          guestName: data.guestName,
          tableNumber: data.tableNumber,
          restaurantSlug: data.restaurantSlug,
          sessionToken: data.sessionToken,
        });
      },

      clearGuest: () =>
        set({
          isRegistered: false,
          guestId: undefined,
          guestName: undefined,
          tableNumber: undefined,
          restaurantSlug: undefined,
          sessionToken: undefined,
        }),
    }),
    {
      name: 'pc-guest',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
