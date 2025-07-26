import React, { useRef, useEffect, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "OANDA:XAUUSD",
        "chartOnly": false,
        "dateRange": "ALL",
        "noTimeScale": false,
        "colorTheme": "light",
        "isTransparent": false,
        "locale": "en",
        "width": "100%",
        "autosize": true,
        "height": "100%"
      }`;
    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);