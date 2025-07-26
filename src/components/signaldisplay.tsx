import React, { useState, useEffect } from 'react';
import { TradingSignal } from './Signal';
import { AdvancedSignalGenerator } from './SignalGenerator';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Wifi } from 'lucide-react';

interface SignalDisplayProps {
  selectedPair: string;
}

const SignalDisplay: React.FC<SignalDisplayProps> = ({ selectedPair }) => {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generator] = useState(() => new AdvancedSignalGenerator());

  useEffect(() => {
    const generateNewSignal = () => {
      setIsLoading(true);
      
      // Simulate analysis time
      setTimeout(() => {
        const newSignal = generator.generateSignal(selectedPair);
        setSignal(newSignal);
        setIsLoading(false);
      }, 1500);
    };

    generateNewSignal();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(generateNewSignal, 120000);
    
    return () => clearInterval(interval);
  }, [selectedPair, generator]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-white text-lg font-semibold mb-2">Analyzing Market</div>
        <div className="text-gray-400">Processing 5 signal conditions...</div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <div className="text-white text-lg font-semibold mb-2">No Signal Available</div>
        <div className="text-gray-400">Market conditions don't meet our criteria</div>
      </div>
    );
  }

  const signalColor = signal.direction === 'BUY' ? 'green' : 'red';
  const SignalIcon = signal.direction === 'BUY' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Signal Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SignalIcon className={`w-8 h-8 text-${signalColor}-500`} />
          <div>
            <div className={`text-2xl font-bold text-${signalColor}-500`}>
              {signal.direction} {signal.pair}
            </div>
            <div className="text-gray-400 text-sm flex items-center space-x-2">
              <Wifi className="w-4 h-4" />
              <span>{signal.session} Session • {signal.confidence}% Confidence</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Generated</div>
          <div className="text-white text-sm">
            {signal.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Trade Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Entry Price</div>
          <div className="text-white font-bold text-xl">
            {signal.entry}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Risk:Reward</div>
          <div className="text-blue-400 font-bold text-xl">
            1:{signal.riskReward}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Stop Loss</div>
          <div className="text-red-400 font-semibold text-lg">
            {signal.stopLoss}
          </div>
          <div className="text-gray-500 text-xs">{signal.pips} pips</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Take Profit</div>
          <div className="text-green-400 font-semibold text-lg">
            {signal.takeProfit}
          </div>
          <div className="text-gray-500 text-xs">
            {Math.round(signal.pips * signal.riskReward)} pips
          </div>
        </div>
      </div>

      {/* Condition Analysis */}
      <div className="space-y-3">
        <div className="text-white font-semibold mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Signal Analysis Breakdown</span>
        </div>
        
        {signal.conditions.map((condition) => (
          <div key={condition.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  condition.status === 'bullish' ? 'bg-green-500' :
                  condition.status === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-white font-medium">{condition.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{condition.confidence}%</span>
                <div className="w-16 bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      condition.status === 'bullish' ? 'bg-green-500' :
                      condition.status === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${condition.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-gray-300 text-sm">
              {condition.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalDisplay;
