import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import Header from './Header';

const RiskConfiguration = () => {
  const [riskPercentage, setRiskPercentage] = useState<number | null>(null);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number | null>(null);
  const navigate = useNavigate();
  const { propFirm, accountConfig, updateRiskConfig } = useTradingPlan();

  if (!propFirm || !accountConfig) {
    navigate('/setup/prop-firm');
    return null;
  }

  const riskOptions = [
    {
      value: 0.5,
      label: '0.5%',
      description: 'Ultra Conservative',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      features: [
        'Lowest risk approach',
        'Highest probability of success',
        'Slower account growth',
        'Ideal for beginners'
      ]
    },
    {
      value: 1,
      label: '1%',
      description: 'Conservative',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      popular: true,
      features: [
        'Balanced risk/reward',
        'Industry standard',
        'Steady growth potential',
        'Recommended for most traders'
      ]
    },
    {
      value: 2,
      label: '2%',
      description: 'Aggressive',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500',
      features: [
        'Higher growth potential',
        'Increased risk exposure',
        'Faster target achievement',
        'For experienced traders'
      ]
    }
  ];

  const rewardOptions = [
    {
      value: 1,
      label: '1:1',
      description: 'Equal Risk/Reward',
      color: 'text-gray-400',
      features: [
        'Simple 1:1 ratio',
        'High win rate required',
        'Conservative approach',
        'Lower profit potential'
      ]
    },
    {
      value: 2,
      label: '1:2',
      description: 'Balanced Approach',
      color: 'text-blue-400',
      popular: true,
      features: [
        'Industry standard',
        'Balanced win rate needs',
        'Good profit potential',
        'Recommended ratio'
      ]
    },
    {
      value: 3,
      label: '1:3',
      description: 'High Reward',
      color: 'text-green-400',
      features: [
        'Maximum profit potential',
        'Lower win rate acceptable',
        'Aggressive approach',
        'Higher profit targets'
      ]
    }
  ];

  const calculateProjections = () => {
    if (!riskPercentage || !riskRewardRatio) return null;

    const accountSize = accountConfig.size;
    const riskAmount = accountSize * (riskPercentage / 100);
    const rewardAmount = riskAmount * riskRewardRatio;
    const profitTarget = accountSize * (propFirm.rules.profitTarget / 100);
    const tradesNeeded = Math.ceil(profitTarget / rewardAmount);
    const requiredWinRate = Math.ceil((100 / (1 + riskRewardRatio)) * 1.2); // 20% buffer

    return {
      riskAmount,
      rewardAmount,
      tradesNeeded,
      requiredWinRate,
      profitTarget
    };
  };

  const projections = calculateProjections();

  const handleContinue = () => {
    if (riskPercentage && riskRewardRatio) {
      updateRiskConfig({
        riskPercentage,
        riskRewardRatio
      });
      navigate('/setup/plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-4">
              <Shield className="w-6 h-6" />
              <span className="text-sm font-medium">Step 3 of 5</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Configure Risk Parameters</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Set your risk percentage per trade and risk-reward ratio for optimal position sizing
            </p>
            
            {/* Configuration Summary */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-4 max-w-lg mx-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{propFirm.name}</div>
                  <div className="text-gray-400">Prop Firm</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">${accountConfig.size.toLocaleString()}</div>
                  <div className="text-gray-400">Account Size</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Percentage Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Risk Percentage Per Trade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {riskOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setRiskPercentage(option.value)}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                    riskPercentage === option.value
                      ? `${option.borderColor} ${option.bgColor} shadow-lg`
                      : 'border-gray-700 bg-gray-800/60 hover:border-gray-600'
                  } ${option.popular ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RECOMMENDED
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold ${option.color} mb-2`}>
                      {option.label}
                    </div>
                    <div className="text-white font-semibold mb-1">{option.description}</div>
                    <div className="text-gray-400 text-sm">
                      ${(accountConfig.size * option.value / 100).toLocaleString()} per trade
                    </div>
                  </div>

                  <div className="space-y-3">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`}></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk-Reward Ratio Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Risk-Reward Ratio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewardOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setRiskRewardRatio(option.value)}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                    riskRewardRatio === option.value
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25'
                      : 'border-gray-700 bg-gray-800/60 hover:border-gray-600'
                  } ${option.popular ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        RECOMMENDED
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold ${option.color} mb-2`}>
                      {option.label}
                    </div>
                    <div className="text-white font-semibold mb-1">{option.description}</div>
                    <div className="text-gray-400 text-sm">
                      Risk ${riskPercentage ? (accountConfig.size * riskPercentage / 100).toLocaleString() : 'X'} to make ${riskPercentage ? (accountConfig.size * riskPercentage * option.value / 100).toLocaleString() : 'Y'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projections */}
          {projections && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Trading Plan Projections</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-red-400 text-2xl font-bold mb-2">
                    ${projections.riskAmount.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Risk Per Trade</div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl font-bold mb-2">
                    ${projections.rewardAmount.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Reward Per Trade</div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-blue-400 text-2xl font-bold mb-2">
                    {projections.tradesNeeded}
                  </div>
                  <div className="text-gray-400 text-sm">Trades Needed</div>
                </div>
                
                <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-purple-400 text-2xl font-bold mb-2">
                    {projections.requiredWinRate}%
                  </div>
                  <div className="text-gray-400 text-sm">Required Win Rate</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-xl">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Strategy Overview</span>
                </div>
                <p className="text-gray-300 text-sm">
                  With {riskPercentage}% risk per trade and a 1:{riskRewardRatio} risk-reward ratio, you'll need approximately {projections.tradesNeeded} winning trades 
                  to reach your ${projections.profitTarget.toLocaleString()} profit target. This requires a minimum win rate of {projections.requiredWinRate}% 
                  to account for inevitable losses.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/setup/account')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Account</span>
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!riskPercentage || !riskRewardRatio}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                riskPercentage && riskRewardRatio
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Generate Plan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskConfiguration;