import React, { useState } from 'react';
import { Shield, Calculator, AlertTriangle, TrendingUp, DollarSign, Target, Settings } from 'lucide-react';

const RiskManagement = () => {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [currencyPair, setCurrencyPair] = useState('EURUSD');

  const calculatePositionSize = () => {
    if (!entryPrice || !stopLoss) return 0;
    const riskAmount = (accountBalance * riskPercentage) / 100;
    const pipValue = currencyPair.includes('JPY') ? 0.01 : 0.0001;
    const pipsAtRisk = Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss)) / pipValue;
    const dollarPerPip = 1; // Simplified calculation
    return pipsAtRisk > 0 ? (riskAmount / (pipsAtRisk * dollarPerPip)).toFixed(2) : 0;
  };

  const calculateRSR = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return 0;
    const risk = Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss));
    const reward = Math.abs(parseFloat(takeProfit) - parseFloat(entryPrice));
    return risk > 0 ? (reward / risk).toFixed(2) : 0;
  };

  const riskMetrics = [
    {
      label: 'Daily Risk Limit',
      value: '$200',
      current: '$45',
      percentage: 22.5,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    {
      label: 'Weekly Risk Limit',
      value: '$1,000',
      current: '$320',
      percentage: 32,
      icon: <Shield className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      label: 'Monthly Risk Limit',
      value: '$3,000',
      current: '$890',
      percentage: 29.7,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Max Drawdown',
      value: '5%',
      current: '1.8%',
      percentage: 36,
      icon: <Target className="w-5 h-5" />,
      color: 'text-purple-400'
    }
  ];

  const openPositions = [
    {
      pair: 'EURUSD',
      type: 'Buy',
      size: '0.50',
      entry: '1.0985',
      stopLoss: '1.0965',
      takeProfit: '1.1025',
      currentPrice: '1.0995',
      pnl: '+$50',
      risk: '$100',
      positive: true
    },
    {
      pair: 'GBPUSD',
      type: 'Sell',
      size: '0.30',
      entry: '1.2534',
      stopLoss: '1.2554',
      takeProfit: '1.2494',
      currentPrice: '1.2524',
      pnl: '+$30',
      risk: '$60',
      positive: true
    },
    {
      pair: 'XAUUSD',
      type: 'Buy',
      size: '0.10',
      entry: '2018.45',
      stopLoss: '2015.20',
      takeProfit: '2025.80',
      currentPrice: '2020.15',
      pnl: '+$17',
      risk: '$32.50',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={metric.color}>
                {metric.icon}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{metric.current} / {metric.value}</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-lg font-semibold text-white">{metric.label}</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.percentage > 80 ? 'bg-red-500' :
                  metric.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-2">{metric.percentage}% utilized</div>
          </div>
        ))}
      </div>

      {/* Position Size Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Position Size Calculator</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Balance</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Risk Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(Number(e.target.value))}
                    className="w-full pr-8 pl-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Currency Pair</label>
              <select
                value={currencyPair}
                onChange={(e) => setCurrencyPair(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="USDJPY">USD/JPY</option>
                <option value="XAUUSD">XAU/USD</option>
                <option value="AUDUSD">AUD/USD</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                <input
                  type="number"
                  step="0.00001"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0985"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
                <input
                  type="number"
                  step="0.00001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0965"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit</label>
                <input
                  type="number"
                  step="0.00001"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="1.1025"
                />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Position Size</div>
                  <div className="text-xl font-bold text-white">{calculatePositionSize()} lots</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Risk:Reward Ratio</div>
                  <div className="text-xl font-bold text-green-400">1:{calculateRSR()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Positions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Open Positions</h3>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold">{position.pair}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      position.type === 'Buy' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {position.type}
                    </span>
                    <span className="text-gray-400 text-sm">{position.size} lots</span>
                  </div>
                  <div className={`font-semibold ${position.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {position.pnl}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400">Entry</div>
                    <div className="text-white">{position.entry}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Current</div>
                    <div className="text-white">{position.currentPrice}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">S/L</div>
                    <div className="text-red-400">{position.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">T/P</div>
                    <div className="text-green-400">{position.takeProfit}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Amount:</span>
                    <span className="text-yellow-400">{position.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-blue-400 mb-1">Total Risk Exposure</div>
              <div className="text-xl font-bold text-white">$192.50</div>
              <div className="text-sm text-gray-400 mt-1">1.93% of account</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Rules */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Management Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-white font-medium">Daily Loss Limit</span>
            </div>
            <p className="text-sm text-gray-400">Maximum 2% of account per day</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-white font-medium">Max Open Positions</span>
            </div>
            <p className="text-sm text-gray-400">No more than 5 concurrent trades</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-white font-medium">Risk Per Trade</span>
            </div>
            <p className="text-sm text-gray-400">Maximum 1% risk per single trade</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;