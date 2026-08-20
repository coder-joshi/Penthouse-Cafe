import { Outlet } from 'react-router-dom';
import { FloatingTicketBar } from '../components/cart/FloatingTicketBar';

export const RestaurantLayout = () => {
  return (
    <div className="bg-linen min-h-dvh flex flex-col relative">
      <main className="flex-1 w-full max-w-7xl mx-auto pb-24 lg:pb-0">
        <Outlet />
      </main>
      
      <FloatingTicketBar />
    </div>
  );
};
