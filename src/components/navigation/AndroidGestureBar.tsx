import React from 'react';

export const AndroidGestureBar: React.FC = () => {
  return (
    <div className="w-full h-4 flex items-center justify-center pointer-events-none select-none pb-1">
      <div className="w-32 h-1 bg-white/40 rounded-full" />
    </div>
  );
};
