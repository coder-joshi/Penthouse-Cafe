import React from 'react';

interface StatusTrackerProps {
  status: 'received' | 'preparing' | 'ready' | 'served';
}

const steps = [
  { id: 'received', label: 'Received' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Served' }
];

export const StatusTracker: React.FC<StatusTrackerProps> = ({ status }) => {
  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="flex items-center justify-between w-full relative">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;


        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              {/* Connecting Line (drawn from center of this node to center of next node) */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-[2px] absolute top-3 md:top-3 lg:top-3 transition-colors duration-300 ${
                    index < currentIndex ? 'bg-brass' : 'bg-gray-200'
                  }`} 
                  style={{ 
                    left: '50%',
                    width: '100%',
                    zIndex: -1 
                  }}
                />
              )}
              
              <div 
                className={`flex items-center justify-center rounded-full mb-2 transition-all duration-300 ${
                  isCompleted ? 'bg-brass text-paper w-6 h-6' : 
                  isActive ? 'bg-brass motion-safe:animate-pulse w-8 h-8' : 
                  'bg-gray-200 w-6 h-6'
                }`}
              >
                {isCompleted && (
                  <span className="text-xs font-bold">✓</span>
                )}
              </div>
              <span 
                className={`font-mono text-xs uppercase tracking-wider text-center ${
                  isActive ? 'text-brass font-semibold' : 
                  isCompleted ? 'text-charcoal-text' : 
                  'text-charcoal-text/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
