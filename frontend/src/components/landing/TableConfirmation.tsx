import React from 'react';

interface TableConfirmationProps {
  tableNumber: string;
}

export const TableConfirmation: React.FC<TableConfirmationProps> = ({ tableNumber }) => {
  return (
    <div className="bg-paper rounded-[6px] px-6 py-4 shadow-sm border border-brass/20 flex flex-col items-center justify-center text-center">
      <span className="font-body text-sm text-charcoal-text/60 mb-1">
        You're at
      </span>
      <div className="font-mono text-3xl text-brass font-bold tracking-tight">
        Table {tableNumber}
      </div>
    </div>
  );
};
