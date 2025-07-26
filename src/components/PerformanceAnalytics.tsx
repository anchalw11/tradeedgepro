import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Calendar, DollarSign, Activity, Award, Filter } from 'lucide-react';
import { getTrades } from '../../trading-journal-frontend/src/api';

interface Trade {
  date: string;
  pair: string;
  type: 'buy' | 'sell';
  result: string;
  profit: string;
  profitValue: number;
  pips: number;
  rsr: string;
  rsrValue: number;
  isWin: boolean;
}

interface PerformanceData {
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  avgRsr: number;
  profitChange: number;
  tradesChange: number;
  winRateChange: number;
  rsrChange: number;
  filteredTrades: Trade[];
}

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('profit');
  const [realTimeData, setRealTimeData] = useState<{
    trades: Trade[];
    performance: PerformanceData | {};
    lastUpdate: Date;
  }>({
    trades: [],
    performance: {},
    lastUpdate: new Date()
  });

  const fetchTradingData = async (): Promise<Trade[]> => {
    try {
      const response = await getTrades();
      const trades: Trade[] = response.data.map((trade: any) => ({
        date: trade.date,
        pair: trade.asset,
        type: trade.direction,
        result: `${trade.outcome === 'win' ? '+' : '-'}${trade.pips} pips`,
        profit: `${trade.outcome === 'win' ? '+' : '-'}$${Math.abs(trade.profit)}`,
        profitValue: trade.profit,
        pips: trade.pips,
        rsr: `1:${trade.rsr}`,
        rsrValue: trade.rsr,
        isWin: trade.outcome === 'win',
      }));
      return trades.sort((a: Trade, b: Trade) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to fetch trading data:', error);
      return [];
    }
  };

  // Calculate performance metrics from real trading data
  const calculatePerformanceMetrics = (trades: Trade[]) => {
    const filteredTrades = filterTradesByTimeRange(trades, timeRange);
    const previousPeriodTrades = getPreviousPeriodTrades(trades, timeRange);
    
    // Current period calculations
    const totalProfit = filteredTrades.reduce((sum, trade) => sum + trade.profitValue, 0);
    const totalTrades = filteredTrades.length;
    const winningTrades = filteredTrades.filter(trade => trade.isWin).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const avgRsr = filteredTrades.length > 0 ? 
      filteredTrades.reduce((sum, trade) => sum + trade.rsrValue, 0) / filteredTrades.length : 0;
    
    // Previous period calculations for comparison
    const prevTotalProfit = previousPeriodTrades.reduce((sum, trade) => sum + trade.profitValue, 0);
    const prevTotalTrades = previousPeriodTrades.length;
    const prevWinningTrades = previousPeriodTrades.filter(trade => trade.isWin).length;
    const prevWinRate = prevTotalTrades > 0 ? (prevWinningTrades / prevTotalTrades) * 100 : 0;
    const prevAvgRsr = previousPeriodTrades.length > 0 ? 
      previousPeriodTrades.reduce((sum, trade) => sum + trade.rsrValue, 0) / previousPeriodTrades.length : 0;
    
    // Calculate changes
    const profitChange = prevTotalProfit !== 0 ? ((totalProfit - prevTotalProfit) / Math.abs(prevTotalProfit)) * 100 : 0;
    const tradesChange = prevTotalTrades !== 0 ? ((totalTrades - prevTotalTrades) / prevTotalTrades) * 100 : 0;
    const winRateChange = winRate - prevWinRate;
    const rsrChange = avgRsr - prevAvgRsr;
    
    return {
      totalProfit,
      totalTrades,
      winRate,
      avgRsr,
      profitChange,
      tradesChange,
      winRateChange,
      rsrChange,
      filteredTrades
    };
  };

  // Filter trades by time range
  const filterTradesByTimeRange = (trades: Trade[], range: string) => {
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return trades.filter(trade => new Date(trade.date) >= startDate);
  };

  // Get previous period trades for comparison
  const getPreviousPeriodTrades = (trades: Trade[], range: string) => {
    const now = new Date();
    let startDate, endDate;
    
    switch (range) {
      case '7d':
        endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        endDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        endDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        startDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }
    
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate >= startDate && tradeDate < endDate;
    });
  };

  // Generate monthly data from trades
  const generateMonthlyData = (trades: Trade[]) => {
    const monthlyStats = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    trades.forEach(trade => {
      const tradeDate = new Date(trade.date);
      const monthKey = months[tradeDate.getMonth()];
      
      if (!(monthlyStats as any)[monthKey]) {
        (monthlyStats as any)[monthKey] = { profit: 0, trades: 0, wins: 0 };
      }
      
      (monthlyStats as any)[monthKey].profit += trade.profitValue;
      (monthlyStats as any)[monthKey].trades += 1;
      if (trade.isWin) (monthlyStats as any)[monthKey].wins += 1;
    });
    
    return months.map(month => ({
      month,
      profit: (monthlyStats as any)[month]?.profit || 0,
      trades: (monthlyStats as any)[month]?.trades || 0,
      winRate: (monthlyStats as any)[month]?.trades > 0 ? 
        ((monthlyStats as any)[month].wins / (monthlyStats as any)[month].trades) * 100 : 0
    })).filter(data => data.trades > 0);
  };

  // Generate top pairs performance
  const generateTopPairs = (trades: Trade[]) => {
    const pairStats = {};
    
    trades.forEach(trade => {
      if (!(pairStats as any)[trade.pair]) {
        (pairStats as any)[trade.pair] = { trades: 0, wins: 0, profit: 0, totalRsr: 0 };
      }
      
      (pairStats as any)[trade.pair].trades += 1;
      (pairStats as any)[trade.pair].profit += trade.profitValue;
      (pairStats as any)[trade.pair].totalRsr += trade.rsrValue;
      if (trade.isWin) (pairStats as any)[trade.pair].wins += 1;
    });
    
    return Object.entries(pairStats)
      .map(([pair, stats]: [string, any]) => ({
        pair,
        trades: stats.trades,
        winRate: parseFloat(((stats.wins / stats.trades) * 100).toFixed(1)),
        profit: Math.round(stats.profit),
        avgRSR: parseFloat((stats.totalRsr / stats.trades).toFixed(1))
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  };

  // Initialize and update data
  useEffect(() => {
    const updateData = async () => {
      const trades = await fetchTradingData();
      const performance = calculatePerformanceMetrics(trades);
      
      setRealTimeData({
        trades,
        performance,
        lastUpdate: new Date()
      });
    };

    updateData(); // Initial load
    
    const handleTradesUpdated = () => {
      updateData();
    };

    window.addEventListener('tradesUpdated', handleTradesUpdated);
    // Update every 30 seconds for real-time feel
    const interval = setInterval(updateData, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('tradesUpdated', handleTradesUpdated);
    };
  }, [timeRange]);

  // Recalculate when time range changes
  useEffect(() => {
    if (realTimeData.trades.length > 0) {
      const performance = calculatePerformanceMetrics(realTimeData.trades);
      setRealTimeData(prev => ({ ...prev, performance }));
    }
  }, [timeRange]);

  const performance = realTimeData.performance as PerformanceData;
  
  if (!performance.totalProfit && performance.totalProfit !== 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading real-time analytics...</div>
      </div>
    );
  }

  // Dynamic performance stats
  const performanceStats = [
    {
      label: 'Total Profit',
      value: `$${performance.totalProfit?.toLocaleString() || '0'}`,
      change: `${performance.profitChange >= 0 ? '+' : ''}${performance.profitChange?.toFixed(1) || '0'}%`,
      changeValue: `${performance.profitChange >= 0 ? '+' : ''}$${Math.abs((performance.totalProfit || 0) * (performance.profitChange || 0) / 100).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      label: 'Win Rate',
      value: `${performance.winRate?.toFixed(1) || '0'}%`,
      change: `${performance.winRateChange >= 0 ? '+' : ''}${performance.winRateChange?.toFixed(1) || '0'}%`,
      changeValue: `${performance.winRateChange >= 0 ? '+' : ''}${performance.winRateChange?.toFixed(1) || '0'}pp`,
      icon: <Target className="w-6 h-6" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      label: 'Total Trades',
      value: `${performance.totalTrades || '0'}`,
      change: `${performance.tradesChange >= 0 ? '+' : ''}${performance.tradesChange?.toFixed(1) || '0'}%`,
      changeValue: `${performance.tradesChange >= 0 ? '+' : ''}${Math.round((performance.totalTrades || 0) * (performance.tradesChange || 0) / 100)}`,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      label: 'Profit Factor',
      value: `${performance.avgRsr?.toFixed(2) || '0.00'}`,
      change: `${performance.rsrChange >= 0 ? '+' : ''}${performance.rsrChange?.toFixed(2) || '0.00'}`,
      changeValue: `${performance.rsrChange >= 0 ? '+' : ''}${performance.rsrChange?.toFixed(2) || '0.00'}`,
      icon: <Award className="w-6 h-6" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    }
  ];

  // Generate dynamic monthly data
  const monthlyData = generateMonthlyData(realTimeData.trades);
  
  // Generate dynamic top pairs
  const topPairs = generateTopPairs(performance.filteredTrades);
  
  // Get recent trades (last 10)
  const recentTrades = realTimeData.trades.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">Live Analytics</span>
          </div>
          <span className="text-green-300 text-sm">
            Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
            <p className="text-gray-400">Real-time analysis of your trading performance</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${parseFloat(stat.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                  <div className="text-xs text-gray-400">{stat.changeValue}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Performance</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="profit">Profit</option>
              <option value="trades">Trades</option>
              <option value="winRate">Win Rate</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const getValue = () => {
                switch (selectedMetric) {
                  case 'profit': return `$${data.profit.toLocaleString()}`;
                  case 'trades': return data.trades.toString();
                  case 'winRate': return `${data.winRate.toFixed(1)}%`;
                  default: return data.profit;
                }
              };
              
              const getMaxValue = () => {
                switch (selectedMetric) {
                  case 'profit': return Math.max(...monthlyData.map(d => d.profit));
                  case 'trades': return Math.max(...monthlyData.map(d => d.trades));
                  case 'winRate': return 100;
                  default: return Math.max(...monthlyData.map(d => d.profit));
                }
              };
              
              const getCurrentValue = () => {
                switch (selectedMetric) {
                  case 'profit': return Math.abs(data.profit);
                  case 'trades': return data.trades;
                  case 'winRate': return data.winRate;
                  default: return Math.abs(data.profit);
                }
              };
              
              const percentage = (getCurrentValue() / getMaxValue()) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-400">{data.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${data.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-white">{getValue()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Pairs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Performing Pairs</h3>
          <div className="space-y-4">
            {topPairs.map((pair, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-white">{pair.pair}</div>
                  <div className={`font-semibold ${pair.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${pair.profit >= 0 ? '' : '-'}${Math.abs(pair.profit).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Trades</div>
                    <div className="text-white">{pair.trades}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Win Rate</div>
                    <div className="text-white">{pair.winRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Avg RSR</div>
                    <div className="text-white">1:{pair.avgRSR}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trading History */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Trading History</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All Trades ({realTimeData.trades.length})
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Pair</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Result</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">P&L</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">RSR</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-4 text-gray-300">{trade.date}</td>
                  <td className="py-3 px-4 text-white font-medium">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.type === 'buy' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{trade.result}</td>
                  <td className={`py-3 px-4 font-medium ${
                    trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.profit}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{trade.rsr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Performance Insights */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">AI Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${(performance.winRate || 0) > 80 ? 'bg-green-600/20 border-green-600' : 'bg-blue-600/20 border-blue-600'} border rounded-lg p-4`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className={`w-5 h-5 ${(performance.winRate || 0) > 80 ? 'text-green-400' : 'text-blue-400'}`} />
              <span className={`${(performance.winRate || 0) > 80 ? 'text-green-400' : 'text-blue-400'} font-semibold`}>
                {(performance.winRate || 0) > 80 ? 'Excellent' : 'Good'} Performance
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Current win rate of {performance.winRate?.toFixed(1)}% shows {(performance.winRate || 0) > 85 ? 'exceptional' : 'solid'} trading discipline across {performance.totalTrades} trades.
            </p>
          </div>
          
          <div className={`${Math.abs(performance.profitChange || 0) > 20 ? 'bg-yellow-600/20 border-yellow-600' : 'bg-blue-600/20 border-blue-600'} border rounded-lg p-4`}>
            <div className="flex items-center space-x-2 mb-2">
              <Target className={`w-5 h-5 ${Math.abs(performance.profitChange || 0) > 20 ? 'text-yellow-400' : 'text-blue-400'}`} />
              <span className={`${Math.abs(performance.profitChange || 0) > 20 ? 'text-yellow-400' : 'text-blue-400'} font-semibold`}>
                {(performance.profitChange || 0) > 0 ? 'Growth' : 'Opportunity'}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              {(performance.profitChange || 0) > 0 ?
                `Profit increased by {performance.profitChange?.toFixed(1)}% compared to previous period - excellent momentum.` :
                `Consider reviewing strategy as profit declined by ${Math.abs(performance.profitChange || 0).toFixed(1)}% this period.`
              }
            </p>
          </div>
          
          <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Risk Analysis</span>
            </div>
            <p className="text-sm text-gray-300">
              Average risk-reward ratio of 1:{performance.avgRsr?.toFixed(1)} indicates {(performance.avgRsr || 0) > 2 ? 'excellent' : 'good'} risk management practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
