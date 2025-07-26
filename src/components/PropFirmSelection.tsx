import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import { propFirms } from '../data/propFirms';

const PropFirmSelection = () => {
  const [selectedFirm, setSelectedFirm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { updatePropFirm } = useTradingPlan();

  const recommendedFirms = [
    "FTMO",
    "Goat Funded Trader",
    "The 5%ers",
    "Apex Trader Funding",
    "FundedNext",
    "Blueberry Funded",
    "QuantTekel (Quant Tekel)",
    "FundingPips",
  ];

  const filteredFirms = propFirms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedFirm) {
      const firm = propFirms.find(f => f.name === selectedFirm);
      if (firm) {
        const firmWithRules = {
          ...firm,
          logo: '🏆',
          description: 'A description',
          rules: {
            dailyLoss: parseFloat(firm.dailyLossLimit),
            maxDrawdown: parseFloat(firm.maximumLoss),
            profitTarget: parseFloat(firm.profitTargets),
            minTradingDays: parseInt(firm.minTradingDays),
            challengeTypes: firm.accountTypes,
            accountSizes: firm.accountSizes,
            maxPositionSize: 2,
            scalingTarget: 10,
          }
        };
        updatePropFirm(firmWithRules);
        navigate('/setup/account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-4">
              <Building className="w-6 h-6" />
              <span className="text-sm font-medium">Step 1 of 5</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Select Your Prop Firm</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose from 130+ supported prop firms. We'll automatically extract their rules and requirements.
            </p>
          </div>


          {/* Prop Firms Dropdown */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prop firms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
              </div>
              <select
                value={selectedFirm}
                onChange={(e) => {
                  console.log(`Selected firm: ${e.target.value}`);
                  setSelectedFirm(e.target.value);
                }}
                className="w-full pl-3 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a Prop Firm</option>
                {filteredFirms.map((firm) => (
                  <option key={firm.id} value={firm.name}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Didn't find your prop firm? Email it to us at{' '}
                <a href="mailto:forex@traderedgepro.com" className="text-blue-400 hover:underline">
                  forex@traderedgepro.com
                </a>{' '}
                and we will add it for you in 24-48 hours.
              </p>
            </div>
          </div>

          {/* Top Recommended Firms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Top Recommended Firms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedFirms.map(firmName => {
                const firm = propFirms.find(f => f.name === firmName);
                if (!firm) return null;
                return (
                  <div
                    key={firm.id}
                    onClick={() => setSelectedFirm(firm.name)}
                    className={`bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 cursor-pointer transition-all hover:border-blue-500 hover:scale-105 ${selectedFirm === firm.name ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{firm.name}</h3>
                      {firm.name === "FTMO" && <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-1 rounded-full">POPULAR</span>}
                    </div>
                    <p className="text-sm text-gray-400 mb-4 h-16">{`A leading prop firm with various account types.`}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Daily Loss:</span>
                        <span className="text-white">{firm.dailyLossLimit}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Max Drawdown:</span>
                        <span className="text-white">{firm.maximumLoss}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Profit Target:</span>
                        <span className="text-white">{firm.profitTargets.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Firm Details */}
          {selectedFirm && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                {selectedFirm} - Detailed Rules
              </h3>
              
              {(() => {
                const firm = propFirms.find(f => f.name === selectedFirm);
                if (!firm) return null;
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Account Types</h4>
                      <div className="space-y-2 text-sm">
                        {firm.accountTypes.map((type, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-400">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Account Sizes</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sizes:</span>
                          <span className="text-white">{firm.accountSizes.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Rules</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit Targets:</span>
                          <span className="text-white">{firm.profitTargets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Daily Loss Limit:</span>
                          <span className="text-white">{firm.dailyLossLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Maximum Loss:</span>
                          <span className="text-white">{firm.maximumLoss}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Trading Days:</span>
                          <span className="text-white">{firm.minTradingDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Limits:</span>
                          <span className="text-white">{firm.timeLimits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Leverage:</span>
                          <span className="text-white">{firm.leverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit Split:</span>
                          <span className="text-white">{firm.profitSplit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payout Schedule:</span>
                          <span className="text-white">{firm.payoutSchedule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Overnight Positions:</span>
                          <span className="text-white">{firm.overnightPositions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">News Trading:</span>
                          <span className="text-white">{firm.newsTrading}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Weekend Holding:</span>
                          <span className="text-white">{firm.weekendHolding}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform:</span>
                          <span className="text-white">{firm.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Instruments:</span>
                          <span className="text-white">{firm.instruments.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!selectedFirm}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedFirm
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropFirmSelection;
