import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  LogOut,
  Activity,
  BarChart3,
  Zap,
  Globe,
  Bot
} from 'lucide-react';
import { useSignalDistribution } from './SignalDistributionService';

interface User {
  id: string;
  name: string;
  email: string;
  membershipTier: string;
  accountSize: number;
  riskPercentage: number;
  riskRewardRatio: number;
  propFirm: string;
  isActive: boolean;
}

interface Signal {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entry: string;
  stopLoss: string;
  takeProfit: string[];
  confidence: number;
  analysis: string;
  ictConcepts: string[];
  timestamp: Date;
  sentToUsers: number;
  status: 'draft' | 'sent' | 'active' | 'closed';
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { distributeSignal } = useSignalDistribution();
  const [activeUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Trader',
      email: 'john@example.com',
      membershipTier: 'Professional',
      accountSize: 100000,
      riskPercentage: 1,
      riskRewardRatio: 2,
      propFirm: 'FTMO',
      isActive: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      membershipTier: 'Elite',
      accountSize: 200000,
      riskPercentage: 0.5,
      riskRewardRatio: 3,
      propFirm: 'MyForexFunds',
      isActive: true
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      membershipTier: 'Professional',
      accountSize: 50000,
      riskPercentage: 2,
      riskRewardRatio: 2,
      propFirm: 'The5%ers',
      isActive: true
    }
  ]);

  const [signals, setSignals] = useState<Signal[]>([]);
  const [newSignal, setNewSignal] = useState({
    pair: 'EURUSD',
    direction: 'BUY' as 'BUY' | 'SELL',
    entry: '',
    stopLoss: '',
    takeProfit: '',
    confidence: 90,
    analysis: '',
    ictConcepts: [] as string[],
    timeframe: '15m'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSignalSent, setLastSignalSent] = useState<Date | null>(null);

  const currencyPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 
    'USDCAD', 'NZDUSD', 'EURJPY', 'GBPJPY', 'XAUUSD', 
    'XAGUSD', 'BTCUSD', 'ETHUSD'
  ];

  const ictConceptOptions = [
    'Fair Value Gap', 'Order Block', 'Liquidity Sweep', 'Change of Character',
    'Premium Array', 'Discount Array', 'Market Structure', 'Institutional Orderflow',
    'Golden Zone', 'Mitigation', 'Bearish Order Block', 'Bullish FVG'
  ];

  // Calculate position sizes for each user based on their risk management
  const calculateUserPositions = (signal: any) => {
    return activeUsers.map(user => {
      const riskAmount = user.accountSize * (user.riskPercentage / 100);
      const entryPrice = parseFloat(signal.entry);
      const stopLossPrice = parseFloat(signal.stopLoss);
      const pipValue = signal.pair.includes('JPY') ? 0.01 : 0.0001;
      const pipsAtRisk = Math.abs(entryPrice - stopLossPrice) / pipValue;
      const dollarPerPip = 1; // Simplified
      const positionSize = pipsAtRisk > 0 ? (riskAmount / (pipsAtRisk * dollarPerPip)).toFixed(2) : '0.00';
      
      return {
        ...user,
        positionSize,
        riskAmount,
        pipsAtRisk: Math.round(pipsAtRisk)
      };
    });
  };

  const sendSignal = async () => {
    if (!newSignal.entry || !newSignal.stopLoss || !newSignal.takeProfit) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Create signal object
      const signal: Signal = {
        id: Date.now().toString(),
        pair: newSignal.pair,
        direction: newSignal.direction,
        entry: newSignal.entry,
        stopLoss: newSignal.stopLoss,
        takeProfit: newSignal.takeProfit.split(',').map(tp => tp.trim()),
        confidence: newSignal.confidence,
        analysis: newSignal.analysis,
        ictConcepts: newSignal.ictConcepts,
        timestamp: new Date(),
        sentToUsers: activeUsers.filter(u => u.isActive).length,
        status: 'sent'
      };

      // Distribute signal to all users with personalized risk management
      const personalizedSignals = distributeSignal(signal, activeUsers);
      
      // Simulate API calls to send notifications
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to signals history
      setSignals(prev => [signal, ...prev]);
      setLastSignalSent(new Date());

      // Reset form
      setNewSignal({
        pair: 'EURUSD',
        direction: 'BUY',
        entry: '',
        stopLoss: '',
        takeProfit: '',
        confidence: 90,
        analysis: '',
        ictConcepts: [],
        timeframe: '15m'
      });

      // Show success message
      alert(`Signal sent successfully to ${personalizedSignals.length} active users with personalized position sizes!\n\nEach user received customized entry, position size, and take profit levels based on their risk management settings.`);

    } catch (error) {
      console.error('Error sending signal:', error);
      alert('Failed to send signal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConcept = (concept: string) => {
    setNewSignal(prev => ({
      ...prev,
      ictConcepts: prev.ictConcepts.includes(concept)
        ? prev.ictConcepts.filter(c => c !== concept)
        : [...prev.ictConcepts, concept]
    }));
  };

  const stats = [
    {
      label: 'Active Users',
      value: activeUsers.filter(u => u.isActive).length.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      label: 'Signals Sent Today',
      value: signals.filter(s => 
        s.timestamp.toDateString() === new Date().toDateString()
      ).length.toString(),
      icon: <Zap className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      label: 'Total Account Value',
      value: `$${activeUsers.reduce((sum, user) => sum + user.accountSize, 0).toLocaleString()}`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      label: 'Last Signal',
      value: lastSignalSent ? lastSignalSent.toLocaleTimeString() : 'None',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold text-white">Signal Master Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 bg-red-600/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-400">Admin Mode</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Signal Creation Form */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Send className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Create & Send Signal</h3>
            </div>

            <div className="space-y-6">
              {/* Basic Signal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency Pair</label>
                  <select
                    value={newSignal.pair}
                    onChange={(e) => setNewSignal(prev => ({ ...prev, pair: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {currencyPairs.map(pair => (
                      <option key={pair} value={pair}>{pair}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewSignal(prev => ({ ...prev, direction: 'BUY' }))}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        newSignal.direction === 'BUY'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      BUY
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewSignal(prev => ({ ...prev, direction: 'SELL' }))}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        newSignal.direction === 'SELL'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <TrendingDown className="w-4 h-4 inline mr-2" />
                      SELL
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Levels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={newSignal.entry}
                    onChange={(e) => setNewSignal(prev => ({ ...prev, entry: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="1.08500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={newSignal.stopLoss}
                    onChange={(e) => setNewSignal(prev => ({ ...prev, stopLoss: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                    placeholder="1.08300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit (comma separated)</label>
                  <input
                    type="text"
                    value={newSignal.takeProfit}
                    onChange={(e) => setNewSignal(prev => ({ ...prev, takeProfit: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                    placeholder="1.08700, 1.08900, 1.09100"
                    required
                  />
                </div>
              </div>

              {/* Confidence and Analysis */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confidence Level: {newSignal.confidence}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={newSignal.confidence}
                  onChange={(e) => setNewSignal(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Analysis</label>
                <textarea
                  value={newSignal.analysis}
                  onChange={(e) => setNewSignal(prev => ({ ...prev, analysis: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Detailed market analysis and reasoning for this signal..."
                />
              </div>

              {/* ICT Concepts */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ICT Concepts</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ictConceptOptions.map(concept => (
                    <button
                      key={concept}
                      type="button"
                      onClick={() => toggleConcept(concept)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newSignal.ictConcepts.includes(concept)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={sendSignal}
                disabled={isLoading || !newSignal.entry || !newSignal.stopLoss || !newSignal.takeProfit}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Signal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Signal to {activeUsers.filter(u => u.isActive).length} Users</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Users & Position Preview */}
          <div className="space-y-6">
            {/* Position Size Preview */}
            {newSignal.entry && newSignal.stopLoss && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Position Size Preview</h4>
                <div className="space-y-3">
                  {calculateUserPositions(newSignal).slice(0, 3).map(user => (
                    <div key={user.id} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{user.name}</span>
                        <span className="text-blue-400 font-semibold">{user.positionSize} lots</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Risk: ${user.riskAmount.toFixed(0)} ({user.riskPercentage}%) • {user.pipsAtRisk} pips
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Users */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Active Users ({activeUsers.filter(u => u.isActive).length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activeUsers.filter(u => u.isActive).map(user => (
                  <div key={user.id} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{user.name}</span>
                      <span className="text-green-400 text-xs">●</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.membershipTier} • ${user.accountSize.toLocaleString()} • {user.riskPercentage}% risk
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Signals */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Signals</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {signals.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No signals sent yet</p>
                  </div>
                ) : (
                  signals.slice(0, 5).map(signal => (
                    <div key={signal.id} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{signal.pair}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          signal.direction === 'BUY' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                        }`}>
                          {signal.direction}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Sent to {signal.sentToUsers} users • {signal.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;