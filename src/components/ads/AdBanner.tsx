import React, { useState } from 'react';

export interface AdBannerProps {
  zoneKey: '383e5798db5ea984cad6739ec47ed810' | '4b4e471c9bb70321a89ff1db782c427e' | string;
  width: number;
  height: number;
  label?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  zoneKey,
  width,
  height,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Sandboxed document HTML to execute the external atOptions and invoke.js safely
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

  return (
    <div
      className={`relative mx-auto flex items-center justify-center overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/[0.05] transition-opacity duration-300 ${className}`}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: `${height}px`
      }}
    >
      <iframe
        title={`Ad ${zoneKey}`}
        srcDoc={iframeSrcDoc}
        width={width}
        height={height}
        scrolling="no"
        frameBorder="0"
        onLoad={() => setIsLoaded(true)}
        className={`border-0 transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-95'
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: 'none',
          overflow: 'hidden'
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
      />
    </div>
  );
};
