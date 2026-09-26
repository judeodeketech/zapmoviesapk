import React, { useState } from 'react';
import { DownloadedItem, MediaItem } from '../types';
import {
  Download,
  Play,
  Trash2,
  HardDrive,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface DownloadsScreenProps {
  downloads: DownloadedItem[];
  onPlayDownloaded: (item: DownloadedItem) => void;
  onDeleteDownload: (id: string) => void;
  onExplore: () => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  downloads,
  onPlayDownloaded,
  onDeleteDownload,
  onExplore
}) => {
  const [smartDownloads, setSmartDownloads] = useState(true);

  // Calculate total downloaded size
  const totalItems = downloads.length;

  return (
    <div className="w-full min-h-screen pb-24 bg-[#08080a] text-slate-100 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-3 bg-[#08080a]/95 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#F5B301]">
              <Download size={18} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-tight">Downloads</h1>
              <span className="text-[10px] text-slate-400 font-medium block">
                {totalItems} video{totalItems === 1 ? '' : 's'} available offline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-[#F5B301] text-[10px] font-bold">
            <CheckCircle2 size={12} />
            <span>Ready Offline</span>
          </div>
        </div>

        {/* Device Storage Meter */}
        <div className="mt-4 p-3 rounded-2xl bg-[#111118] ring-1 ring-white/[0.04]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <HardDrive size={13} className="text-[#F5B301]" />
              <span className="text-[11px] font-medium">Device Storage</span>
            </div>
            <span className="text-[11px] font-mono text-slate-300">
              3.8 GB <span className="text-slate-500">/ 128 GB</span>
            </span>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden flex">
            <div className="w-[12%] bg-[#F5B301] rounded-full shadow-[0_0_8px_#F5B301]" />
            <div className="w-[28%] bg-slate-700 ml-1 rounded-full opacity-40" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B301]" /> ZapMovies (3.8 GB)
            </span>
            <span>Free: 88.4 GB</span>
          </div>
        </div>

        {/* Smart Downloads Toggle */}
        <div className="mt-3 p-3 rounded-2xl bg-[#111118] ring-1 ring-white/[0.04] flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-white block text-[11px]">Smart Downloads</span>
            <span className="text-[10px] text-slate-400">Auto-downloads next episode when on Wi-Fi</span>
          </div>
          <button
            type="button"
            onClick={() => setSmartDownloads(!smartDownloads)}
            className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              smartDownloads ? 'bg-[#F5B301]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                smartDownloads ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Downloads List */}
      <div className="px-5 pt-2">
        {downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayDownloaded(item)}
                className="group p-2.5 rounded-2xl bg-[#111118] hover:bg-[#161622] ring-1 ring-white/[0.04] hover:ring-[#F5B301]/30 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              >
                {/* Left Thumbnail with Play Button */}
                <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-md">
                      <Play size={13} className="fill-slate-950 ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-slate-300">
                    {item.runtime}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-[#F5B301] transition-colors">
                    {item.title}
                  </h3>
                  {item.seasonEpisode && (
                    <span className="text-[10px] font-semibold text-amber-400 block mt-0.5">
                      {item.seasonEpisode}
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                    <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-300">{item.quality}</span>
                    <span>{item.size}</span>
                  </div>
                </div>

                {/* Right Action: Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDownload(item.id);
                  }}
                  aria-label={`Delete ${item.title}`}
                  className="w-8 h-8 rounded-full text-slate-500 hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-[#F5B301] mb-4">
              <Download size={28} />
            </div>
            <h3 className="text-base font-bold text-white">No downloads yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Movies and series you download will appear here so you can watch offline anytime, anywhere.
            </p>
            <button
              type="button"
              onClick={onExplore}
              className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#F5B301]/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Blockbusters</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
