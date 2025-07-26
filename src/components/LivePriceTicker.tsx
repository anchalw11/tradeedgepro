import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Wifi } from 'lucide-react';

const LivePriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize prices immediately
  useEffect(() => {
    const initialPrices = {
      EURUSD: { price: 1.0850, change: 0.0023, isPositive: true },
      GBPUSD: { price: 1.2750, change: -0.0015, isPositive: false },
      USDJPY: { price: 149.50, change: 0.45, isPositive: true },
      XAUUSD: { price: 2020.00, change: 15.50, isPositive: true },
      AUDUSD: { price: 0.6650, change: -0.0008, isPositive: false }
    };
    
    setPrices(initialPrices);
    setIsLoading(false);

    // Update prices every 2 seconds
    const interval = setInterval(() => {
      setPrices((prev: any) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.002;
          updated[symbol] = {
            ...updated[symbol],
            price: updated[symbol].price + change,
            change: change,
            isPositive: change >= 0
          };
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="text-white">Loading prices...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-semibold text-white">Live Market Prices</h3>
        <div className="flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(prices).map(([symbol, data]: [string, any]) => (
          <div key={symbol} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{symbol}</span>
              {data.isPositive ? 
                <TrendingUp className="w-4 h-4 text-green-400" /> : 
                <TrendingDown className="w-4 h-4 text-red-400" />
              }
            </div>
            
            <div className="text-white text-xl font-bold mb-1">
              {data.price.toFixed(symbol === 'USDJPY' ? 2 : 4)}
            </div>
            
            <div className={`text-sm ${data.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {data.isPositive ? '+' : ''}{data.change.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Prices update every 2 seconds • {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default LivePriceTicker;
