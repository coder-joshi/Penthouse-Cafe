import { Link } from 'react-router-dom';

export const TableNotFoundPage = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-linen p-4">
      <div className="bg-paper p-8 rounded-[6px] shadow-sm max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🍽️</div>
        
        <h1 className="fraunces-heading text-2xl text-charcoal-text">
          Table Not Found
        </h1>
        
        <p className="text-charcoal-text/60 text-sm leading-relaxed mt-3">
          We couldn't find this table. Please scan the QR code on your table to get started.
        </p>
        
        <Link 
          to="/"
          className="bg-wine text-paper px-6 py-3 rounded-[6px] font-body font-semibold mt-6 inline-block w-full"
        >
          Scan Again
        </Link>
      </div>
    </div>
  );
};
