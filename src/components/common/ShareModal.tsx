import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Mail,
  QrCode,
  Download,
  ExternalLink
} from 'lucide-react';
import { MediaItem, Episode } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  media?: MediaItem | null;
  episode?: Episode | null;
  seasonNumber?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  media,
  episode,
  seasonNumber
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  // Build title and share message
  const isEpisode = Boolean(episode);
  const title = media
    ? isEpisode
      ? `${media.title} (S${seasonNumber || 1}:E${episode?.episodeNumber || 1} - ${episode?.title || 'Episode'})`
      : media.title
    : 'ZapMovies - 4K Movies & TV Streaming';

  const overview = episode?.description || media?.overview || media?.description || 'Stream movies and TV series in 4K Ultra HD on ZapMovies!';
  const truncatedOverview = overview.length > 110 ? `${overview.slice(0, 110)}...` : overview;

  // Build clean deep share link
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : 'https://zapmovies.app';
  const shareUrl = media
    ? `${currentUrl}?watch=${encodeURIComponent(media.id)}${isEpisode ? `&s=${seasonNumber || 1}&e=${episode?.episodeNumber || 1}` : ''}`
    : currentUrl;

  const shareText = `Watch "${title}" on ZapMovies: ${truncatedOverview}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        });
        onClose();
      } catch (err) {
        // User cancelled or share unsupported
        console.debug('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareTargets = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'bg-neutral-800 hover:bg-neutral-700',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-amber-600 hover:bg-amber-700',
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(`Check out "${title}" on ZapMovies`)}&body=${encodeURIComponent(`${shareText}\n\nWatch here: ${shareUrl}`)}`,
          '_blank'
        );
      }
    },
    {
      name: 'QR Code',
      icon: QrCode,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => {
        setShowQR((prev) => !prev);
      }
    }
  ];

  // Quick QR API URL for instant scanning
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}&color=0-0-0&bgcolor=245-179-1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share Media"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0e0e16] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC72C] to-[#F5B301] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#F5B301]/20">
              <Share2 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Share to Friends
              </h2>
              <p className="text-[11px] text-slate-400">
                Share via social apps, direct link, or QR code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Media Preview Card */}
        {media && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
            <img
              src={media.poster || media.backdrop}
              alt={media.title}
              referrerPolicy="no-referrer"
              className="w-12 h-16 rounded-xl object-cover shrink-0 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {title}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <span>{media.year}</span>
                <span>·</span>
                <span className="capitalize">{media.type}</span>
                <span>·</span>
                <span className="text-[#F5B301] font-semibold">{media.rating} ★</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                {truncatedOverview}
              </p>
            </div>
          </div>
        )}

        {/* Native Mobile Share Button (if supported on Android/iOS) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#F5B301]/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Share2 size={15} />
            <span>Open Android System Share Menu</span>
          </button>
        )}

        {/* Social Share Grid */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-2.5">
            Share directly to
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {shareTargets.map((target) => {
              const Icon = target.icon;
              return (
                <button
                  key={target.name}
                  type="button"
                  onClick={target.action}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group cursor-pointer active:scale-95"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${target.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 truncate max-w-full">
                    {target.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Reveal (Collapsible) */}
        {showQR && (
          <div className="p-4 rounded-2xl bg-[#08080c] border border-[#F5B301]/30 flex flex-col items-center justify-center space-y-2 animate-fade-in">
            <span className="text-[11px] font-bold text-amber-300">
              Scan with camera to watch on mobile
            </span>
            <div className="p-2 bg-[#F5B301] rounded-xl shadow-lg">
              <img
                src={qrApiUrl}
                alt="QR Code"
                className="w-36 h-36 rounded-lg block"
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-xs text-center font-mono">
              {shareUrl}
            </span>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Or copy share link
          </span>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/60 border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2.5 text-xs text-slate-200 outline-none font-mono truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#F5B301] hover:bg-amber-400 text-slate-950 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
