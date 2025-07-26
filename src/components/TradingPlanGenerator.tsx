import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import Header from './Header';

const TradingPlanGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { propFirm, accountConfig, riskConfig, updateTradingPlan } = useTradingPlan();
  const [selectedPlan, setSelectedPlan] = useState<'30day' | '45day' | '60day'>('30day');

  // Redirect if required data is missing
  if (!propFirm || !accountConfig || !riskConfig) {
    navigate('/setup/prop-firm');
    return null;
  }

  const accountSize = accountConfig.size;
  
  // Derive risk tolerance from risk percentage
  const getRiskTolerance = (riskPercentage: number): 'conservative' | 'moderate' | 'aggressive' => {
    if (riskPercentage <= 0.5) return 'conservative';
    if (riskPercentage <= 1) return 'moderate';
    return 'aggressive';
  };
  
  const riskTolerance = getRiskTolerance(riskConfig.riskPercentage);

  // Prop firm rules database
  const propFirmRules = {
    FTMO: {
      dailyLoss: 5,
      maxDrawdown: 10,
      profitTarget: 10,
      minTradingDays: 10,
      maxPositionSize: 2,
      scalingTarget: 10
    },
    MyForexFunds: {
      dailyLoss: 5,
      maxDrawdown: 12,
      profitTarget: 8,
      minTradingDays: 5,
      maxPositionSize: 3,
      scalingTarget: 8
    },
    'The5%ers': {
      dailyLoss: 5,
      maxDrawdown: 4,
      profitTarget: 6,
      minTradingDays: 6,
      maxPositionSize: 1,
      scalingTarget: 6
    }
  };

  const rules = propFirmRules[propFirm.name as keyof typeof propFirmRules] || propFirmRules.FTMO;

  // Risk parameters based on tolerance
  const riskParams = {
    conservative: { baseRisk: 0.5, maxRisk: 1.0, targetMultiplier: 2 },
    moderate: { baseRisk: 1.0, maxRisk: 1.5, targetMultiplier: 2.5 },
    aggressive: { baseRisk: 1.5, maxRisk: 2.0, targetMultiplier: 3 }
  };

  const params = riskParams[riskTolerance];

  // Generate trading plan
  const generateTradingPlan = (timeline: '30day' | '45day' | '60day') => {
    const days = timeline === '30day' ? 30 : timeline === '45day' ? 45 : 60;
    const profitTarget = (accountSize * rules.profitTarget) / 100;
    
    const trades = [
      {
        id: 1,
        risk: params.baseRisk,
        target: params.baseRisk * params.targetMultiplier,
        timeframe: '1-2 days',
        expectedReturn: (accountSize * params.baseRisk * params.targetMultiplier) / 100,
        pairs: ['EUR/USD', 'GBP/USD']
      },
      {
        id: 2,
        risk: params.baseRisk + 0.25,
        target: (params.baseRisk + 0.25) * params.targetMultiplier,
        timeframe: '2-3 days',
        expectedReturn: (accountSize * (params.baseRisk + 0.25) * params.targetMultiplier) / 100,
        pairs: ['USD/JPY', 'XAU/USD']
      },
      {
        id: 3,
        risk: params.maxRisk,
        target: params.maxRisk * params.targetMultiplier,
        timeframe: '1-4 days',
        expectedReturn: (accountSize * params.maxRisk * params.targetMultiplier) / 100,
        pairs: ['AUD/USD', 'EUR/GBP']
      },
      {
        id: 4,
        risk: params.maxRisk,
        target: params.maxRisk * (params.targetMultiplier + 1),
        timeframe: '3-5 days',
        expectedReturn: (accountSize * params.maxRisk * (params.targetMultiplier + 1)) / 100,
        pairs: ['GBP/JPY', 'USD/CAD']
      },
      {
        id: 5,
        risk: params.maxRisk + 0.5,
        target: (params.maxRisk + 0.5) * (params.targetMultiplier + 1.5),
        timeframe: '2-6 days',
        expectedReturn: (accountSize * (params.maxRisk + 0.5) * (params.targetMultiplier + 1.5)) / 100,
        pairs: ['XAU/USD', 'BTC/USD']
      }
    ];

    const totalExpectedReturn = trades.reduce((sum, trade) => sum + trade.expectedReturn, 0);
    const phase1Return = totalExpectedReturn;
    const phase2Return = profitTarget - phase1Return;

    return {
      trades,
      timeline: {
        phase1: Math.min(15, days / 2),
        phase2: days - Math.min(15, days / 2),
        total: days
      },
      targets: {
        phase1Return,
        phase2Return,
        totalTarget: profitTarget,
        monthlyEarnings: timeline === '30day' ? profitTarget : (profitTarget * 30) / days
      }
    };
  };

  const plan = generateTradingPlan(selectedPlan);

  const handleContinue = () => {
    // Save the generated plan to context
    updateTradingPlan(plan);
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const downloadPlan = () => {
    const planData = {
      propFirm: propFirm.name,
      accountSize: accountConfig.size,
      challengeType: accountConfig.challengeType,
      riskPercentage: riskConfig.riskPercentage,
      riskRewardRatio: riskConfig.riskRewardRatio,
      timeline: selectedPlan,
      trades: plan.trades,
      targets: plan.targets,
      timeline_details: plan.timeline
    };
    
    const dataStr = JSON.stringify(planData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${propFirm.name}_Trading_Plan_${accountConfig.size}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-4">
              <Target className="w-6 h-6" />
              <span className="text-sm font-medium">Step 4 of 5</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Custom Trading Plan</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Personalized trading strategy for your {propFirm.name} {accountConfig.challengeType} challenge
            </p>
            
            {/* Configuration Summary */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{propFirm.name}</div>
                  <div className="text-gray-400">Prop Firm</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">${accountConfig.size.toLocaleString()}</div>
                  <div className="text-gray-400">Account Size</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{riskConfig.riskPercentage}%</div>
                  <div className="text-gray-400">Risk Per Trade</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-semibold">1:{riskConfig.riskRewardRatio}</div>
                  <div className="text-gray-400">Risk:Reward</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Plan Selection */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Select Trading Plan Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: '30day', label: '30-Day Plan', desc: 'Aggressive timeline' },
                  { id: '45day', label: '45-Day Plan', desc: 'Balanced approach' },
                  { id: '60day', label: '60-Day Plan', desc: 'Conservative timeline' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPlan(option.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPlan === option.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-gray-400 mt-1">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prop Firm Rules */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{propFirm.name} Trading Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-white font-medium">Daily Loss Limit</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">{rules.dailyLoss}%</div>
                  <div className="text-sm text-gray-400">${(accountSize * rules.dailyLoss / 100).toLocaleString()}</div>
                </div>
                
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-white font-medium">Profit Target</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">{rules.profitTarget}%</div>
                  <div className="text-sm text-gray-400">${(accountSize * rules.profitTarget / 100).toLocaleString()}</div>
                </div>
                
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">Max Drawdown</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{rules.maxDrawdown}%</div>
                  <div className="text-sm text-gray-400">${(accountSize * rules.maxDrawdown / 100).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Trading Sequence */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detailed Trading Sequence</h3>
              <div className="space-y-4">
                {plan.trades.map((trade, index) => (
                  <div key={trade.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {trade.id}
                        </div>
                        <span className="text-white font-medium">Trade {trade.id}</span>
                      </div>
                      <div className="text-blue-500 font-semibold">
                        +${trade.expectedReturn.toFixed(0)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Risk</div>
                        <div className="text-white font-medium">{trade.risk}%</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Target</div>
                        <div className="text-blue-400 font-medium">{trade.target}%</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Timeframe</div>
                        <div className="text-white">{trade.timeframe}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Pairs</div>
                        <div className="text-white">{trade.pairs.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Timeline */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Plan Completion Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-600/20 border border-blue-600 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Phase 1 (Days 1-{plan.timeline.phase1})</span>
                    </div>
                    <div className="text-white">Complete Trades 1-5</div>
                    <div className="text-blue-500 font-semibold">
                      Target: +${plan.targets.phase1Return.toFixed(0)} ({((plan.targets.phase1Return / accountSize) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  
                  <div className="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Phase 2 (Days {plan.timeline.phase1 + 1}-{plan.timeline.total})</span>
                    </div>
                    <div className="text-white">Scale to higher risk trades</div>
                    <div className="text-yellow-500 font-semibold">
                      Target: +${plan.targets.phase2Return.toFixed(0)} ({((plan.targets.phase2Return / accountSize) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-4">Expected Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Timeline:</span>
                      <span className="text-white">{plan.timeline.total} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Target:</span>
                      <span className="text-blue-500 font-semibold">${plan.targets.totalTarget.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Earnings:</span>
                      <span className="text-blue-500 font-semibold">${plan.targets.monthlyEarnings.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-blue-500 font-semibold">87-95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Management Protocol */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Management Protocol</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Maximum daily loss: {rules.dailyLoss}% of account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Maximum total open risk: 3% of account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Consecutive loss limit: 3 trades maximum</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Recovery protocol after losses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Automated position sizing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-white text-sm">Real-time rule compliance monitoring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={downloadPlan}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Plan</span>
                </button>
                
                <button
                  onClick={handleContinue}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => navigate('/setup/risk')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Risk Config</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlanGenerator;