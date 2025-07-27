import React, { useState, useEffect, useRef, memo } from 'react';
import { Zap, TrendingUp, TrendingDown, Clock, Target, AlertTriangle, CheckCircle, Filter, Shield, XCircle, CheckSquare, Globe, Send, Copy, RefreshCw, MessageSquare, Bot } from 'lucide-react';
import TradingViewMiniChart from './TradingViewMiniChart';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import { addTrade } from '../../trading-journal-frontend/src/api';
import { telegramService, TelegramMessage } from '../services/telegramService';

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
  const [showWebhookPanel, setShowWebhookPanel] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io/');
  const [webhookResults, setWebhookResults] = useState<any[]>([]);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { propFirm, accountConfig, riskConfig } = useTradingPlan();
  const [telegramMessages, setTelegramMessages] = useState<any[]>([]);
  const [showTelegramPanel, setShowTelegramPanel] = useState(true); // Start with panel open
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isListening, setIsListening] = useState(true); // Start listening by default
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [signals, setSignals] = useState<Signal[]>([
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
  ]);

  // Check API status and initialize
  useEffect(() => {
    const checkApiStatus = async () => {
      const isOnline = await telegramService.checkHealth();
      setApiStatus(isOnline ? 'online' : 'offline');
      
      if (isOnline) {
        // Load existing messages
        const messages = await telegramService.getMessages();
        setTelegramMessages(messages);
      }
    };

    checkApiStatus();
  }, []);

  // Subscribe to real-time messages when listening
  useEffect(() => {
    if (isListening && apiStatus === 'online') {
      telegramService.subscribe('signals-feed', (message: TelegramMessage) => {
        setTelegramMessages(prev => [message, ...prev.slice(0, 49)]);
        
        // Auto-detect and parse trading signals
        if (isLikelyTradingSignal(message.text)) {
          const newSignal = parseMessageToSignal(message.text, message);
          if (newSignal) {
            setSignals(prev => [newSignal, ...prev]);
          }
        }
      });
      
      telegramService.startListening();
    } else {
      telegramService.unsubscribe('signals-feed');
      telegramService.stopListening();
    }
    
    return () => {
      telegramService.unsubscribe('signals-feed');
    };
  }, [isListening, apiStatus]);

  // Parse telegram message and convert to signal format
  const parseMessageToSignal = (text: string, message: any): Signal | null => {
    try {
      const lines = text.split('\n').map(line => line.trim());
      let pair = '';
      let entry = '';
      let stopLoss = '';
      let target = '';
      
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        // Extract currency pair
        if (lowerLine.includes('asset') || lowerLine.includes('eur/usd')) {
          const pairMatch = line.match(/(EUR\/USD|GBP\/USD|USD\/JPY|XAU\/USD|AUD\/USD|EURUSD|GBPUSD|USDJPY|XAUUSD|AUDUSD)/i);
          if (pairMatch) {
            pair = pairMatch[1].replace('/', '').toUpperCase();
          }
        }
        
        // Extract entry price
        if (lowerLine.includes('entry')) {
          const priceMatch = line.match(/(\d+\.?\d*)/);
          if (priceMatch) entry = priceMatch[1];
        }
        
        // Extract stop loss
        if (lowerLine.includes('stop loss')) {
          const priceMatch = line.match(/(\d+\.?\d*)/);
          if (priceMatch) stopLoss = priceMatch[1];
        }
        
        // Extract target
        if (lowerLine.includes('target')) {
          const priceMatch = line.match(/(\d+\.?\d*)/);
          if (priceMatch) target = priceMatch[1];
        }
      });
      
      if (pair && entry && stopLoss && target) {
        // Determine if it's buy or sell based on entry vs target
        const entryPrice = parseFloat(entry);
        const targetPrice = parseFloat(target);
        const type = targetPrice > entryPrice ? 'Buy' : 'Sell';
        
        return {
          id: Date.now(),
          pair,
          type: type as 'Buy' | 'Sell',
          entry,
          stopLoss,
          takeProfit: [target],
          confidence: 90,
          timeframe: '15m',
          timestamp: 'Just now',
          status: 'active',
          analysis: `Signal from Telegram: ${text.substring(0, 100)}...`,
          ictConcepts: ['Telegram Signal', 'Manual Entry'],
          rsr: '1:2',
          pips: 'Pending',
          positive: null
        };
      }
    } catch (error) {
      console.error('Error parsing Telegram signal:', error);
    }
    return null;
  };

  // Check if message looks like a trading signal
  const isLikelyTradingSignal = (text: string): boolean => {
    const signalKeywords = ['buy', 'sell', 'entry', 'tp', 'sl', 'stop loss', 'take profit', 'target', 'asset', 'eurusd', 'gbpusd', 'usdjpy', 'xauusd'];
    const lowerText = text.toLowerCase();
    return signalKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Add new message (simulate real-time)
  const addNewMessage = (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      from: 'You',
      chat_id: chatId,
      message_id: Date.now()
    };
    
    setTelegramMessages(prev => [newMessage, ...prev.slice(0, 49)]);
    
    // Auto-detect and parse trading signals
    if (isLikelyTradingSignal(text)) {
      const newSignal = parseMessageToSignal(text, newMessage);
      if (newSignal) {
        setSignals(prev => [newSignal, ...prev]);
      }
    }
  };

  // Simulate receiving a new message every 30 seconds for demo
  useEffect(() => {
    if (!isListening) return;
    
    const interval = setInterval(() => {
      // This would be replaced with actual Telegram API polling
      console.log('Listening for new messages...');
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isListening]);

  const stopTelegramListener = () => {
    setIsListening(false);
    telegramService.stopListening();
  };

  const startTelegramListener = async () => {
    if (apiStatus !== 'online') {
      alert('Telegram API is not running. Please start the webhook server first.');
      return;
    }
    setIsListening(true);
    telegramService.startListening();
  };

  // Send message to Telegram
  const sendTelegramMessage = async (message: string) => {
    if (!botToken || !chatId) {
      alert('Please configure Bot Token and Chat ID');
      return;
    }
    
    try {
      // In a real implementation, this would send to Telegram API
      console.log('Sending to Telegram:', message);
      
      // Simulate adding the sent message to our feed
      addNewMessage(`Bot: ${message}`);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  };

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
        lot_size: 1,
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

    return {
      safe: warnings.length === 0,
      warnings
    };
  };

  // Webhook testing function
  const testWebhook = async (signal?: Signal) => {
    setIsTestingWebhook(true);
    
    const testPayload = signal ? {
      type: 'trading_signal',
      timestamp: new Date().toISOString(),
      source: 'TraderEdge Pro',
      signal: {
        id: signal.id,
        pair: signal.pair,
        direction: signal.type,
        entry: signal.entry,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        confidence: signal.confidence,
        analysis: signal.analysis,
        ictConcepts: signal.ictConcepts
      }
    } : {
      type: 'webhook_test',
      timestamp: new Date().toISOString(),
      source: 'TraderEdge Pro',
      message: 'Test webhook from TraderEdge Pro Dashboard',
      test_data: {
        symbol: 'EURUSD',
        price: 1.0850,
        action: 'test'
      }
    };

    try {
      // Attempt to send webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TraderEdge-Pro-Webhook/1.0'
        },
        body: JSON.stringify(testPayload),
        mode: 'cors'
      });

      const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        url: webhookUrl,
        payload: testPayload,
        response: response.ok ? 'Webhook delivered successfully' : `HTTP ${response.status}: ${response.statusText}`
      };

      setWebhookResults(prev => [result, ...prev.slice(0, 9)]);
      
    } catch (error: any) {
      const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'error',
        statusCode: 0,
        url: webhookUrl,
        payload: testPayload,
        response: `Connection failed: ${error.message}`
      };

      setWebhookResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
  };

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
            
            <button
              onClick={() => setShowWebhookPanel(!showWebhookPanel)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Webhook Test</span>
            </button>
            
            <button
              onClick={() => setShowTelegramPanel(!showTelegramPanel)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Telegram Bot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telegram Bot Integration Panel */}
      {showTelegramPanel && (
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bot className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Telegram Bot Integration</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              apiStatus === 'online' ? 'bg-green-600/20 text-green-400' : 
              apiStatus === 'offline' ? 'bg-red-600/20 text-red-400' : 'bg-yellow-600/20 text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-green-400' : 
                apiStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
              } ${apiStatus === 'online' && isListening ? 'animate-pulse' : ''}`} />
              <span>
                {apiStatus === 'checking' ? 'Checking...' :
                 apiStatus === 'offline' ? 'API Offline' :
                 isListening ? 'Listening' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bot Configuration */}
            <div className="space-y-4">
              {/* API Status */}
              <div className={`p-4 rounded-lg border ${
                apiStatus === 'online' ? 'bg-green-600/20 border-green-600' :
                apiStatus === 'offline' ? 'bg-red-600/20 border-red-600' :
                'bg-yellow-600/20 border-yellow-600'
              }`}>
                <div className={`font-semibold mb-2 ${
                  apiStatus === 'online' ? 'text-green-400' :
                  apiStatus === 'offline' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {apiStatus === 'online' ? '✅ Webhook API Online' :
                   apiStatus === 'offline' ? '❌ Webhook API Offline' :
                   '⏳ Checking API Status...'}
                </div>
                <div className="text-sm text-gray-300">
                  {apiStatus === 'online' ? 'Ready to receive Telegram messages' :
                   apiStatus === 'offline' ? 'Please start the webhook server first' :
                   'Connecting to webhook API...'}
                </div>
              </div>

              {apiStatus === 'online' && (
                <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Webhook URL</div>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs break-all">
                      http://localhost:3001/telegram/webhook
                    </div>
                    <p>Set this URL as your Telegram bot webhook</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                {apiStatus === 'online' && !isListening ? (
                  <button
                    onClick={startTelegramListener}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Start Listening</span>
                  </button>
                ) : apiStatus === 'online' && isListening ? (
                  <button
                    onClick={stopTelegramListener}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Stop Listening</span>
                  </button>
                )}
                
                <button
                  onClick={async () => {
                    await telegramService.checkHealth();
                    const isOnline = await telegramService.checkHealth();
                    setApiStatus(isOnline ? 'online' : 'offline');
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Status</span>
                </button>
              </div>

              {apiStatus === 'offline' && (
                <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
                  <div className="text-red-400 font-semibold mb-2">Start Webhook Server</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Run this command in a new terminal:</p>
                    <div className="bg-gray-700 rounded p-2 font-mono text-xs">
                      npx ts-node src/api/telegramWebhook.ts
                    </div>
                  </div>
                </div>
              )}

              {apiStatus === 'online' && (
                <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-2">Setup Instructions</div>
                <div className="text-sm text-gray-300 space-y-1">
                    <p>1. Create a bot with @BotFather on Telegram</p>
                    <p>2. Set webhook URL: /setwebhook</p>
                    <p>3. Use: http://localhost:3001/telegram/webhook</p>
                    <p>4. Click "Start Listening" to receive messages</p>
                    <p>5. Send messages to your bot!</p>
                  </div>
                </div>
              )}

              {/* Manual Message Input for Testing */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-white font-semibold mb-2">Test Message Input</div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message to simulate..."
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          addNewMessage(input.value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const sampleSignal = `asset- EUR/USD
Entry - 1.23679
Stop loss- 1.23600
Target- 1.23700`;
                      addNewMessage(sampleSignal);
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Add Sample Signal
                  </button>
                </div>
              </div>
            </div>

            {/* Telegram Messages */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Recent Messages ({telegramMessages.length})
              </h4>
              
              {telegramMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages received yet</p>
                  <p className="text-sm">Start listening to see messages from your bot</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {telegramMessages.map((message) => (
                    <div key={message.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 font-medium">@{message.from}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-white text-sm whitespace-pre-wrap">
                        {message.text}
                      </div>
                      {isLikelyTradingSignal(message.text) && (
                        <div className="mt-2 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                          📊 Detected as Trading Signal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Webhook Testing Panel */}
      {showWebhookPanel && (
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Webhook Testing</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Webhook Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your webhook URL"
                  />
                  <button
                    onClick={copyWebhookUrl}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => testWebhook()}
                  disabled={isTestingWebhook || !webhookUrl}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isTestingWebhook ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Test Webhook</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-2">Webhook Information</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• This will send a POST request to your webhook URL</p>
                  <p>• Signals can be automatically sent to your webhook</p>
                  <p>• Your webhook should accept JSON payloads</p>
                  <p>• CORS must be enabled for browser requests</p>
                </div>
              </div>
            </div>

            {/* Webhook Results */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Test Results</h4>
              
              {webhookResults.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No webhook tests performed yet</p>
                  <p className="text-sm">Click "Test Webhook" to send a test payload</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {webhookResults.map((result) => (
                    <div key={result.id} className={`p-4 rounded-lg border ${
                      result.status === 'success' 
                        ? 'bg-green-600/20 border-green-600' 
                        : 'bg-red-600/20 border-red-600'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`font-medium ${
                            result.status === 'success' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {result.status === 'success' ? 'Success' : 'Failed'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <div>Status: {result.statusCode}</div>
                        <div>Response: {result.response}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    {signal.ictConcepts.includes('Telegram Signal') && (
                      <div className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                        📱 From Telegram
                      </div>
                    )}
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
                          <div className="mt-4 space-y-2">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                              Copy Trade
                            </button>
                            <button
                              onClick={() => testWebhook(signal)}
                              disabled={isTestingWebhook}
                              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                              {isTestingWebhook ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              <span>Send to Webhook</span>
                            </button>
                            <button
                              onClick={() => sendTelegramMessage(`🚨 <b>SIGNAL ALERT</b>\n\n📈 ${signal.pair} ${signal.type}\n💰 Entry: ${signal.entry}\n🛑 SL: ${signal.stopLoss}\n🎯 TP: ${signal.takeProfit[0]}\n📊 Confidence: ${signal.confidence}%\n\n${signal.analysis}`)}
                              disabled={!botToken || !chatId}
                              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                              <Bot className="w-3 h-3" />
                              <span>Send to Telegram</span>
                            </button>
                          </div>
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
            <div className="text-2xl font-bold text-blue-400 mb-1">{signals.length}</div>
            <div className="text-sm text-gray-400">Signals Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{signals.filter(s => s.positive === true).length}</div>
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