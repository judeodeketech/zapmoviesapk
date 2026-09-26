import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('10:49');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-50 w-full h-8 px-5 flex items-center justify-between text-xs font-semibold text-slate-300 select-none bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      {/* Left: Clock */}
      <div className="flex items-center gap-1.5 pl-1">
        <span className="font-mono text-[11px] font-medium tracking-tight text-slate-200">
          {timeStr}
        </span>
      </div>

      {/* Center: Punch hole camera cutout */}
      <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#151520]" />
      </div>

      {/* Right: System Icons */}
      <div className="flex items-center gap-2 pr-1 text-slate-300">
        <span className="text-[10px] font-mono tracking-tight font-bold text-slate-300">5G</span>
        <Wifi size={13} className="text-slate-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono text-slate-300">94%</span>
          <BatteryMedium size={14} className="text-slate-200" />
        </div>
      </div>
    </div>
  );
};
