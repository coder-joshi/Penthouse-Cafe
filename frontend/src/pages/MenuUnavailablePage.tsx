export const MenuUnavailablePage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-linen p-4">
      <div className="bg-paper p-8 rounded-[6px] shadow-sm max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🔧</div>
        
        <h1 className="fraunces-heading text-2xl text-charcoal-text">
          Menu Temporarily Unavailable
        </h1>
        
        <p className="text-charcoal-text/60 text-sm leading-relaxed mt-3">
          We're updating our menu right now. Please check back in a few minutes or ask your server for assistance.
        </p>
        
        <button 
          onClick={handleReload}
          className="bg-brass text-paper px-6 py-3 rounded-[6px] font-body font-semibold mt-6 w-full inline-block"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
