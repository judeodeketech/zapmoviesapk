import React, { useState } from 'react';
import { MediaItem, ContinueWatchingItem } from '../types';
import { ContinueWatchingCard } from '../components/cards/ContinueWatchingCard';
import {
  User,
  ShieldCheck,
  Download,
  Wifi,
  Sliders,
  Bell,
  Trash2,
  Info,
  ChevronRight,
  ExternalLink,
  Code2,
  Tv
} from 'lucide-react';

interface ProfileScreenProps {
  continueWatchingList: ContinueWatchingItem[];
  watchlistCount: number;
  onResumeWatching: (item: ContinueWatchingItem) => void;
  onOpenCodeInspector: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  continueWatchingList,
  watchlistCount,
  onResumeWatching,
  onOpenCodeInspector
}) => {
  const [streamQuality, setStreamQuality] = useState('4K Ultra HD (Dolby)');
  const [wifiOnly, setWifiOnly] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="w-full min-h-screen pb-24 bg-[#08080a] text-slate-100 select-none">
      {/* Profile Header */}
      <div className="px-5 pt-6 pb-5 bg-gradient-to-b from-[#14141d] to-[#08080a] border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Avatar with Golden Ring */}
          <div className="relative">
            <div className="w-18 h-18 rounded-full ring-2 ring-[#F5B301] p-1 overflow-hidden bg-slate-800 shadow-[0_0_20px_rgba(245,179,1,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#F5B301] text-slate-950 p-1 rounded-full shadow-md">
              <ShieldCheck size={14} className="stroke-[2.5]" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Alexander Vance</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#F5B301] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                VIP
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">alex.vance@zapmovies.tv</span>
            <span className="text-[11px] text-[#F5B301] font-medium mt-1">
              Zap Ultra Pass · Renews Dec 2026
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="block text-base font-bold text-white tabular-nums">{watchlistCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">Watchlist</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="block text-base font-bold text-white tabular-nums">48h</span>
            <span className="text-[10px] text-slate-400 font-medium">Watch Time</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <span className="block text-base font-bold text-[#F5B301] tabular-nums">4K</span>
            <span className="text-[10px] text-slate-400 font-medium">Stream Tier</span>
          </div>
        </div>
      </div>

      {/* Continue Watching Quick Row */}
      {continueWatchingList.length > 0 && (
        <div className="mt-5">
          <div className="px-5 mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Activity
            </h2>
            <span className="text-[11px] text-[#F5B301]">
              {continueWatchingList.length} in progress
            </span>
          </div>
          <div className="px-5 flex items-center gap-3 overflow-x-auto no-scrollbar touch-scroll pb-2">
            {continueWatchingList.map((item) => (
              <ContinueWatchingCard
                key={item.id}
                item={item}
                onResume={onResumeWatching}
              />
            ))}
          </div>
        </div>
      )}

      {/* Kotlin + Jetpack Compose Inspector Highlight Banner */}
      <div className="px-5 mt-5">
        <button
          type="button"
          onClick={onOpenCodeInspector}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#F5B301]/10 to-transparent border border-[#F5B301]/30 flex items-center justify-between text-left group cursor-pointer hover:border-[#F5B301]/60 transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5B301] text-slate-950 flex items-center justify-center font-bold">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-[#F5B301] transition-colors">
                View Jetpack Compose Architecture
              </h3>
              <p className="text-[11px] text-slate-400">
                Explore Kotlin Composables, Theme, Screens & UI Components
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#F5B301] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Streaming & App Preferences */}
      <div className="px-5 mt-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Playback & App Settings
        </h2>

        {/* Quality Selector */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders size={18} className="text-[#F5B301]" />
            <div>
              <span className="block text-xs font-semibold text-white">Streaming Quality</span>
              <span className="text-[11px] text-slate-400">Select default video resolution</span>
            </div>
          </div>
          <select
            value={streamQuality}
            onChange={(e) => setStreamQuality(e.target.value)}
            className="bg-slate-900 text-amber-300 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#F5B301] cursor-pointer"
          >
            <option value="4K Ultra HD (Dolby)">4K Ultra HD</option>
            <option value="1080p Full HD">1080p Full HD</option>
            <option value="720p HD">720p HD</option>
            <option value="Data Saver">Data Saver</option>
          </select>
        </div>

        {/* Wi-Fi Download Toggle */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi size={18} className="text-[#F5B301]" />
            <div>
              <span className="block text-xs font-semibold text-white">Download via Wi-Fi Only</span>
              <span className="text-[11px] text-slate-400">Prevent cellular data consumption</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWifiOnly(!wifiOnly)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              wifiOnly ? 'bg-[#F5B301]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                wifiOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[#F5B301]" />
            <div>
              <span className="block text-xs font-semibold text-white">New Episodes Alert</span>
              <span className="text-[11px] text-slate-400">Notify when saved series release episodes</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              notifications ? 'bg-[#F5B301]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Storage / Clear Cache */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-slate-400" />
            <div>
              <span className="block text-xs font-semibold text-white">Stream Cache</span>
              <span className="text-[11px] text-slate-400">142 MB cached trailers and thumbnails</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert('Cache cleared successfully!')}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-semibold cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* App Version Info */}
      <div className="px-5 mt-8 text-center">
        <span className="text-[11px] text-slate-500 font-medium block">
          ZapMovies Android v2.6.4 (Jetpack Compose Release)
        </span>
        <span className="text-[10px] text-slate-600 font-mono mt-0.5 block">
          Build ID: ZAP-COMPOSE-2026.09.26
        </span>
      </div>
    </div>
  );
};
