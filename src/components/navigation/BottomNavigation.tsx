import React from 'react';
import { ScreenType } from '../../types';
import { Home, Search, Download, Bookmark, User } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  watchlistCount?: number;
  downloadsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  watchlistCount = 0,
  downloadsCount = 0
}) => {
  const navItems: {
    id: ScreenType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'downloads', label: 'Downloads', icon: Download, badge: downloadsCount },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlistCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Hide bottom nav in video player and splash screen for immersive viewing
  if (currentScreen === 'video_player' || currentScreen === 'splash') {
    return null;
  }

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full px-3 pb-3 pt-1.5 bg-gradient-to-t from-[#040407] via-[#08080c]/95 to-transparent backdrop-blur-md"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto bg-[#101017]/95 rounded-2xl ring-1 ring-white/[0.08] px-1 shadow-[0_12px_36px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer select-none transition-all duration-200 group touch-manipulation ${
                isActive ? 'text-[#F5B301]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Icon Container */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={19}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,179,1,0.6)]' : 'group-hover:scale-105'
                  }`}
                />

                {/* Badge if any */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#F5B301] text-slate-950 font-extrabold text-[8px] flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] tracking-tight mt-1 font-medium transition-colors ${
                  isActive ? 'text-[#F5B301] font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Active Golden Glow Pill Indicator */}
              {isActive && (
                <span className="absolute -bottom-1 w-3.5 h-1 bg-[#F5B301] rounded-full shadow-[0_0_8px_#F5B301]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
