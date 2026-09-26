import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StickyBottomAdProps {
  onClose?: () => void;
  className?: string;
}

export const StickyBottomAd: React.FC<StickyBottomAdProps> = ({
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const zoneKey = '383e5798db5ea984cad6739ec47ed810';
  const width = 320;
  const height = 50;

  const iframeSrcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${zoneKey}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://avouchlawsrethink.com/${zoneKey}/invoke.js"></script>
</body>
</html>`;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={`fixed bottom-14 inset-x-0 z-40 flex justify-center pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${className}`}
    >
      {/* Tight wrapper matching 320x50 exactly with zero bloated margins */}
      <div className="relative pointer-events-auto rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.85)] ring-1 ring-white/10 bg-black/90">
        {/* Floating minimal close button at top-right with no extra layout height */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss Ad"
          className="absolute -top-2.5 -right-2.5 z-30 w-5 h-5 rounded-full bg-[#181822] hover:bg-slate-700 text-slate-300 hover:text-white border border-white/20 flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer"
        >
          <X size={11} strokeWidth={2.5} />
        </button>

        {/* Exact 320x50 Ad Frame - No texts inside */}
        <div className="w-[320px] h-[50px] overflow-hidden rounded-xl bg-black/60 flex items-center justify-center">
          <iframe
            title="Sticky Bottom Ad"
            srcDoc={iframeSrcDoc}
            width={width}
            height={height}
            scrolling="no"
            frameBorder="0"
            className="border-0"
            style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
          />
        </div>
      </div>
    </div>
  );
};
