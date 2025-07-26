import React, { useState, useEffect, useRef, memo } from 'react';
import { Zap, TrendingUp, TrendingDown, Clock, Target, AlertTriangle, CheckCircle, Filter, Shield, XCircle, CheckSquare } from 'lucide-react';
import TradingViewMiniChart from './TradingViewMiniChart';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import { addTrade } from '../../trading-journal-frontend/src/api';

interface Signal {
  id: number;
  pair: string;
  type: 'Buy' | 'Sell';
  entry: string;
  stopLoss: string;
  takeProfit: string[];
  confidence: number;
  timeframe: string;
  timestamp: string;
  status: 'active' | 'closed' | 'pending';
  analysis: string;
  ictConcepts: string[];
  rsr: string;
  pips: string;
  positive: boolean | null;
}

const SignalsFeed = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { propFirm, accountConfig, riskConfig } = useTradingPlan();

  const handleTradeTaken = async (signal: Signal) => {
    try {
      // Simulate trade outcome
      const isWin = Math.random() > 0.3; // 70% win rate
      const exitPrice = isWin
        ? parseFloat(signal.takeProfit[0])
        : parseFloat(signal.stopLoss);
      const outcome = isWin ? 'win' : 'loss';

      const tradeData = {
        date: new Date().toISOString().split('T')[0],
        asset: signal.pair,
        direction: signal.type.toLowerCase() as 'buy' | 'sell',
        entry_price: parseFloat(signal.entry),
        exit_price: exitPrice,
        sl: parseFloat(signal.stopLoss),
        tp: parseFloat(signal.takeProfit[0]),
        lot_size: 1, // Dummy lot size
        outcome: outcome as 'win' | 'loss',
        notes: signal.analysis,
        strategy_tag: signal.ictConcepts.join(', '),
        prop_firm: propFirm?.name || 'N/A',
      };
      await addTrade(tradeData);
      alert('Trade added to journal!');
      window.dispatchEvent(new Event('tradesUpdated'));
    } catch (error) {
      console.error('Failed to add trade to journal:', error);
      alert('Failed to add trade to journal.');
    }
  };

  // Rule breach detection function
  const checkRuleBreach = (signal: any) => {
    if (!propFirm || !accountConfig || !riskConfig) return { safe: true, warnings: [] };

    const warnings: string[] = [];
    const accountSize = accountConfig.size;
    const rules = propFirm.rules;

    // Calculate position size and risk
    const riskAmount = accountSize * (riskConfig.riskPercentage / 100);
    const entryPrice = parseFloat(signal.entry);
    const stopLossPrice = parseFloat(signal.stopLoss);
    const pipValue = signal.pair.includes('JPY') ? 0.01 : 0.0001;
    const pipsAtRisk = Math.abs(entryPrice - stopLossPrice) / pipValue;
    const dollarPerPip = 1; // Simplified
    const positionSize = riskAmount / (pipsAtRisk * dollarPerPip);
    const positionValue = entryPrice * positionSize * 100000; // Standard lot size
    const positionPercentage = (positionValue / accountSize) * 100;

    // Check daily loss limit
    if (riskConfig.riskPercentage > rules.dailyLoss) {
      warnings.push(`⚠️ Risk per trade (${riskConfig.riskPercentage}%) exceeds daily loss limit (${rules.dailyLoss}%)`);
    }

    // Check maximum position size
    if (positionPercentage > rules.maxPositionSize) {
      warnings.push(`⚠️ Position size (${positionPercentage.toFixed(1)}%) exceeds maximum allowed (${rules.maxPositionSize}%)`);
    }

    // Check overnight positions
    if (rules.overnightPositions === false) {
      warnings.push(`⚠️ ${propFirm.name} forbids overnight positions on standard accounts`);
    }

    // Check news trading
    if (rules.newsTrading === false) {
      warnings.push(`⚠️ ${propFirm.name} forbids news trading on standard accounts`);
    }

    // Check weekend holding
    if (rules.weekendHolding === false) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
        warnings.push(`⚠️ ${propFirm.name} forbids weekend holding`);
      }
    }

    // Check consistency rule (FTMO specific)
    if (rules.consistencyRule && signal.pips && signal.pips !== 'Pending') {
      const dailyProfit = Math.abs(parseFloat(signal.pips)) * dollarPerPip * positionSize;
      const totalProfit = accountSize * 0.05; // Assume 5% total profit so far
      if (dailyProfit > totalProfit * 0.5) {
        warnings.push(`⚠️ Single trade profit may exceed 50% of total profit (consistency rule)`);
      }
    }

    return {
      safe: warnings.length === 0,
      warnings
    };
  };

  const signals: Signal[] = [
    {
      id: 1,
      pair: 'EURUSD',
      type: 'Buy',
      entry: '1.0985',
      stopLoss: '1.0965',
      takeProfit: ['1.1005', '1.1025', '1.1045'],
      confidence: 94,
      timeframe: '30m',
      timestamp: '2 minutes ago',
      status: 'active',
      analysis: 'Strong bullish momentum with Fair Value Gap confirmation. London session liquidity showing institutional buying.',
      ictConcepts: ['Fair Value Gap', 'Order Block', 'Liquidity Sweep'],
      rsr: '1:2',
      pips: '+20',
      positive: true
    },
    {
      id: 2,
      pair: 'GBPUSD',
      type: 'Sell',
      entry: '1.2534',
      stopLoss: '1.2554',
      takeProfit: ['1.2514', '1.2494', '1.2474'],
      confidence: 87,
      timeframe: '15m',
      timestamp: '5 minutes ago',
      status: 'closed',
      analysis: 'Market structure break confirmed. Expecting retracement to premium array with CHoCH pattern.',
      ictConcepts: ['Change of Character', 'Premium Array', 'Market Structure'],
      rsr: '1:3',
      pips: '+60',
      positive: true
    },
    {
      id: 3,
      pair: 'XAUUSD',
      type: 'Buy',
      entry: '2018.45',
      stopLoss: '2015.20',
      takeProfit: ['2022.30', '2025.80', '2029.45'],
      confidence: 91,
      timeframe: '1h',
      timestamp: '8 minutes ago',
      status: 'active',
      analysis: 'Golden zone rejection with institutional orderflow. NFP data supporting bullish bias on gold.',
      ictConcepts: ['Golden Zone', 'Orderflow', 'NFP Impact'],
      rsr: '1:2.5',
      pips: '+3.25',
      positive: true
    },
    {
      id: 4,
      pair: 'USDJPY',
      type: 'Sell',
      entry: '149.85',
      stopLoss: '150.15',
      takeProfit: ['149.55', '149.25', '148.95'],
      confidence: 83,
      timeframe: '30m',
      timestamp: '12 minutes ago',
      status: 'pending',
      analysis: 'Bearish order block respected. Expecting mitigation before continuation lower.',
      ictConcepts: ['Bearish Order Block', 'Mitigation', 'Continuation'],
      rsr: '1:3',
      pips: 'Pending',
      positive: null
    },
    {
      id: 5,
      pair: 'AUDUSD',
      type: 'Buy',
      entry: '0.6678',
      stopLoss: '0.6658',
      takeProfit: ['0.6698', '0.6718', '0.6738'],
      confidence: 89,
      timeframe: '1h',
      timestamp: '15 minutes ago',
      status: 'closed',
      analysis: 'Bullish Fair Value Gap filled perfectly. Strong rejection from discount array.',
      ictConcepts: ['Bullish FVG', 'Discount Array', 'Rejection'],
      rsr: '1:2',
      pips: '-20',
      positive: false
    }
  ];

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    if (filter === 'active') return signal.status === 'active';
    if (filter === 'closed') return signal.status === 'closed';
    if (filter === 'pending') return signal.status === 'pending';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600';
      case 'closed':
        return 'bg-green-600/20 text-green-400 border-green-600';
      case 'pending':
        return 'bg-blue-600/20 text-blue-400 border-blue-600';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Trading Signals</h3>
            <p className="text-gray-400">Real-time professional-grade signals with 85-95% accuracy</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Signals</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="confidence">Highest Confidence</option>
              <option value="profit">Best Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
        <div className="h-96">
          <TradingViewMiniChart />
        </div>
      </div>

      {/* Signals Feed */}
      <div className="space-y-4">
        {filteredSignals.map((signal) => (
          <div key={signal.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            {/* Rule Breach Check */}
            {(() => {
              const ruleCheck = checkRuleBreach(signal);
              return !ruleCheck.safe && (
                <div className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-400 mb-2">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Rule Breach Warning</span>
                  </div>
                  <div className="space-y-1">
                    {ruleCheck.warnings.map((warning, idx) => (
                      <div key={idx} className="text-sm text-red-300">{warning}</div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Signal Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-white">{signal.pair}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(signal.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(signal.status)}
                        <span className="capitalize">{signal.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{signal.timestamp}</div>
                    <div className="text-lg font-semibold text-white">{signal.confidence}% Confidence</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Entry</div>
                    <div className="text-lg font-semibold text-blue-400">{signal.entry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Stop Loss</div>
                    <div className="text-lg font-semibold text-red-400">{signal.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Take Profit</div>
                    <div className="text-lg font-semibold text-green-400">{signal.takeProfit[0]}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">R:R Ratio</div>
                    <div className="text-lg font-semibold text-purple-400">{signal.rsr}</div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Analysis</div>
                  <div className="text-white mb-3">{signal.analysis}</div>
                  <div className="flex flex-wrap gap-2">
                    {signal.ictConcepts.map((concept, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Current P&L</div>
                  <div className={`text-2xl font-bold ${
                    signal.positive === null ? 'text-gray-400' :
                    signal.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {signal.pips}
                    {signal.pips !== 'Pending' && ' pips'}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Timeframe:</span>
                      <span className="text-white">{signal.timeframe}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{signal.type}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`trade-taken-${signal.id}`}
                      className="form-checkbox h-5 w-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      onChange={() => handleTradeTaken(signal)}
                    />
                    <label htmlFor={`trade-taken-${signal.id}`} className="text-sm text-gray-300">
                      Mark as Taken
                    </label>
                  </div>

                  {signal.status === 'active' && (
                    <>
                      {(() => {
                        const ruleCheck = checkRuleBreach(signal);
                        return ruleCheck.safe ? (
                          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                            Copy Trade
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="w-full mt-4 bg-red-600/50 text-red-300 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                          >
                            Rule Breach Risk
                          </button>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
            <div className="text-sm text-gray-400">Signals Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">9</div>
            <div className="text-sm text-gray-400">Winning Trades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">91.7%</div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">+347</div>
            <div className="text-sm text-gray-400">Total Pips</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsFeed;
