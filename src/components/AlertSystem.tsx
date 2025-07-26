import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, TrendingUp, TrendingDown, AlertTriangle, Volume2, Mail, MessageSquare } from 'lucide-react';

interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'technical' | 'news';
  condition: string;
  value: number;
  currentPrice?: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  notificationMethods: ('email' | 'push' | 'sms' | 'sound')[];
}

interface PriceData {
  [symbol: string]: number;
}

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<PriceData>({});
  const [recentTriggers, setRecentTriggers] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    symbol: 'EURUSD',
    type: 'price' as const,
    condition: 'above',
    value: 0,
    notificationMethods: ['push', 'sound'] as ('email' | 'push' | 'sms' | 'sound')[]
  });

  const symbols = [
    { value: 'EURUSD', label: 'EUR/USD', basePrice: 1.0850 },
    { value: 'GBPUSD', label: 'GBP/USD', basePrice: 1.2750 },
    { value: 'USDJPY', label: 'USD/JPY', basePrice: 149.50 },
    { value: 'XAUUSD', label: 'XAU/USD (Gold)', basePrice: 2020.00 },
    { value: 'AUDUSD', label: 'AUD/USD', basePrice: 0.6650 },
    { value: 'BTCUSD', label: 'BTC/USD', basePrice: 45000.00 }
  ];

  const conditions = [
    { value: 'above', label: 'Price Above', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'below', label: 'Price Below', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'crosses_up', label: 'Crosses Up Through', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'crosses_down', label: 'Crosses Down Through', icon: <TrendingDown className="w-4 h-4" /> }
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { value: 'push', label: 'Push Notification', icon: <Bell className="w-4 h-4" /> },
    { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'sound', label: 'Sound Alert', icon: <Volume2 className="w-4 h-4" /> }
  ];

  // Simulate real-time price updates
  useEffect(() => {
    const generatePrices = () => {
      const prices: PriceData = {};
      symbols.forEach(symbol => {
        const basePrice = symbol.basePrice;
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        prices[symbol.value] = parseFloat((basePrice + (basePrice * variation)).toFixed(symbol.value.includes('JPY') ? 3 : 5));
      });
      return prices;
    };

    // Initial price load
    setCurrentPrices(generatePrices());

    // Update prices every 2 seconds
    const priceInterval = setInterval(() => {
      setCurrentPrices(generatePrices());
    }, 2000);

    return () => clearInterval(priceInterval);
  }, []);

  // Check alert conditions
  useEffect(() => {
    if (Object.keys(currentPrices).length === 0) return;

    alerts.forEach(alert => {
      if (!alert.isActive || alert.triggered) return;

      const currentPrice = currentPrices[alert.symbol];
      if (!currentPrice) return;

      let shouldTrigger = false;

      switch (alert.condition) {
        case 'above':
          shouldTrigger = currentPrice > alert.value;
          break;
        case 'below':
          shouldTrigger = currentPrice < alert.value;
          break;
        case 'crosses_up':
          // For simplicity, using current price > alert value
          shouldTrigger = currentPrice > alert.value;
          break;
        case 'crosses_down':
          // For simplicity, using current price < alert value
          shouldTrigger = currentPrice < alert.value;
          break;
      }

      if (shouldTrigger) {
        triggerAlert(alert.id, currentPrice);
      }
    });
  }, [currentPrices, alerts]);

  const triggerAlert = (alertId: string, triggeredPrice: number) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        const triggeredAlert = {
          ...alert,
          triggered: true,
          triggeredAt: new Date(),
          currentPrice: triggeredPrice
        };

        // Add to recent triggers
        setRecentTriggers(prevTriggers => [triggeredAlert, ...prevTriggers.slice(0, 4)]);

        // Send notifications
        sendNotifications(triggeredAlert);

        return triggeredAlert;
      }
      return alert;
    }));
  };

  const sendNotifications = (alert: Alert) => {
    alert.notificationMethods.forEach(method => {
      switch (method) {
        case 'sound':
          // Play notification sound
          if ('AudioContext' in window) {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
          }
          break;
        case 'push':
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`TraderEdge Pro Alert: ${alert.symbol}`, {
              body: `${alert.symbol} ${alert.condition} ${alert.value} - Current: ${alert.currentPrice}`,
              icon: '/favicon.ico'
            });
          }
          break;
        case 'email':
          console.log('Email notification sent for alert:', alert.id);
          break;
        case 'sms':
          console.log('SMS notification sent for alert:', alert.id);
          break;
      }
    });
  };

  const createAlert = () => {
    if (newAlert.value <= 0) {
      alert('Please enter a valid price level');
      return;
    }

    const alert: Alert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      type: newAlert.type,
      condition: newAlert.condition,
      value: newAlert.value,
      isActive: true,
      triggered: false,
      createdAt: new Date(),
      notificationMethods: newAlert.notificationMethods
    };

    setAlerts(prev => [...prev, alert]);
    setShowCreateAlert(false);
    setNewAlert({ 
      symbol: 'EURUSD', 
      type: 'price', 
      condition: 'above', 
      value: 0,
      notificationMethods: ['push', 'sound']
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const resetAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, triggered: false, triggeredAt: undefined, currentPrice: undefined } : alert
    ));
  };

  const getSymbolLabel = (symbol: string) => {
    return symbols.find(s => s.value === symbol)?.label || symbol;
  };

  const activeAlerts = alerts.filter(alert => alert.isActive && !alert.triggered);
  const triggeredAlerts = alerts.filter(alert => alert.triggered);
  const pausedAlerts = alerts.filter(alert => !alert.isActive);

  return (
    <div className="space-y-6">
      {/* Main Alert System */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-500" />
              {recentTriggers.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Price Alert System</h3>
              <p className="text-sm text-gray-400">
                {activeAlerts.length} active • {triggeredAlerts.length} triggered
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateAlert(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Alert</span>
          </button>
        </div>

        {/* Recent Triggers */}
        {recentTriggers.length > 0 && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400 mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Recent Alert Triggers</span>
            </div>
            <div className="space-y-2">
              {recentTriggers.slice(0, 3).map(alert => (
                <div key={`trigger-${alert.id}`} className="text-sm text-gray-300">
                  <span className="font-medium">{getSymbolLabel(alert.symbol)}</span> {alert.condition} {alert.value} 
                  (Triggered at {alert.currentPrice} • {alert.triggeredAt?.toLocaleTimeString()})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Prices Display */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {symbols.map(symbol => (
            <div key={symbol.value} className="bg-gray-700/50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-400">{symbol.value}</div>
              <div className="text-white font-mono">
                {currentPrices[symbol.value]?.toFixed(symbol.value.includes('JPY') ? 3 : 5) || 'Loading...'}
              </div>
            </div>
          ))}
        </div>

        {/* Alert Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
          <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium">
            Active ({activeAlerts.length})
          </button>
          <button className="flex-1 py-2 px-4 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-600">
            Triggered ({triggeredAlerts.length})
          </button>
          <button className="flex-1 py-2 px-4 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-600">
            Paused ({pausedAlerts.length})
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 text-lg font-medium mb-2">No alerts created yet</div>
              <div className="text-sm text-gray-500 mb-4">Set up price alerts to get notified when market conditions are met</div>
              <button
                onClick={() => setShowCreateAlert(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create Your First Alert
              </button>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`bg-gray-700/50 rounded-lg p-4 border transition-all ${
                alert.triggered ? 'border-red-500 bg-red-500/10' : 
                alert.isActive ? 'border-green-500/50' : 'border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.triggered ? 'bg-red-500 animate-pulse' :
                      alert.isActive ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="text-white font-medium">{getSymbolLabel(alert.symbol)}</div>
                      <div className="text-sm text-gray-400">
                        {conditions.find(c => c.value === alert.condition)?.label} {alert.value}
                        {currentPrices[alert.symbol] && (
                          <span className="ml-2 text-blue-400">
                            (Current: {currentPrices[alert.symbol].toFixed(alert.symbol.includes('JPY') ? 3 : 5)})
                          </span>
                        )}
                      </div>
                      {alert.triggeredAt && (
                        <div className="text-xs text-red-400">
                          Triggered at {alert.triggeredAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {alert.triggered && (
                      <button
                        onClick={() => resetAlert(alert.id)}
                        className="px-3 py-1 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 rounded text-sm transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        alert.isActive 
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                          : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                      }`}
                    >
                      {alert.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white">Create Price Alert</h4>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trading Pair</label>
                <select
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {symbols.map(symbol => (
                    <option key={symbol.value} value={symbol.value}>{symbol.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alert Condition</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Price Level
                  {currentPrices[newAlert.symbol] && (
                    <span className="text-blue-400 ml-2">
                      (Current: {currentPrices[newAlert.symbol].toFixed(newAlert.symbol.includes('JPY') ? 3 : 5)})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  step={newAlert.symbol.includes('JPY') ? "0.001" : "0.00001"}
                  value={newAlert.value || ''}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price level"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Notification Methods</label>
                <div className="space-y-2">
                  {notificationOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAlert.notificationMethods.includes(option.value as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAlert(prev => ({
                              ...prev,
                              notificationMethods: [...prev.notificationMethods, option.value as any]
                            }));
                          } else {
                            setNewAlert(prev => ({
                              ...prev,
                              notificationMethods: prev.notificationMethods.filter(method => method !== option.value)
                            }));
                          }
                        }}
                        className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <span className="text-white">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={createAlert}
                  disabled={newAlert.value <= 0 || newAlert.notificationMethods.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowCreateAlert(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;
