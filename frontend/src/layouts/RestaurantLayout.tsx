import { Outlet, useLocation, useParams } from 'react-router-dom';
import { FloatingTicketBar } from '../components/cart/FloatingTicketBar';

export const RestaurantLayout = () => {
  const location = useLocation();
  const { restaurantSlug, tableNumber } = useParams();
  
  // Clean up paths for comparison (remove trailing slashes)
  const currentPath = location.pathname.replace(/\/$/, '');
  const landingPath = `/r/${restaurantSlug}/t/${tableNumber}`;
  const isLandingPage = currentPath === landingPath;

  return (
    <div className="bg-linen min-h-dvh flex flex-col relative">
      <main className={`flex-1 w-full ${isLandingPage ? '' : 'max-w-7xl mx-auto pb-24 lg:pb-0'}`}>
        <Outlet />
      </main>
      
      {!isLandingPage && <FloatingTicketBar />}
    </div>
  );
};
