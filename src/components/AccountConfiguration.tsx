import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTradingPlan } from '../contexts/TradingPlanContext';
import Header from './Header';

const AccountConfiguration = () => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const navigate = useNavigate();
  const { propFirm, updateAccountConfig } = useTradingPlan();

  if (!propFirm) {
    navigate('/setup/prop-firm');
    return null;
  }

  const handleContinue = () => {
    if (selectedSize && selectedType) {
      updateAccountConfig({
        size: selectedSize,
        challengeType: selectedType
      });
      navigate('/setup/risk');
    }
  };

  const getChallengeTypeDescription = (type: string) => {
    const descriptions = {
      '1-step': 'Single evaluation phase - reach profit target while staying within risk limits',
      '2-step': 'Two-phase evaluation - challenge phase followed by verification phase',
      '3-step': 'Three-phase evaluation - challenge, verification, and final assessment',
      'instant-funding': 'Immediate funding with no evaluation required'
    };
    return descriptions[type as keyof typeof descriptions] || 'Standard evaluation process';
  };

  const getChallengeTypeFeatures = (type: string) => {
    const features = {
      '1-step': [
        'Fastest path to funding',
        'Single profit target',
        'Direct to funded account',
        'Lower evaluation cost'
      ],
      '2-step': [
        'Most popular option',
        'Two-phase verification',
        'Proven track record',
        'Balanced risk/reward'
      ],
      '3-step': [
        'Comprehensive evaluation',
        'Multiple verification phases',
        'Highest success rate',
        'Thorough assessment'
      ],
      'instant-funding': [
        'No evaluation required',
        'Immediate access',
        'Start trading today',
        'Higher fees apply'
      ]
    };
    return features[type as keyof typeof features] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-4">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium">Step 2 of 5</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Configure Your Account</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Select your account size and challenge type for <span className="text-blue-400 font-semibold">{propFirm.name}</span>
            </p>
            
            {/* Prop Firm Summary */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">{propFirm.logo}</span>
                <div>
                  <div className="text-white font-semibold">{propFirm.name}</div>
                  <div className="text-sm text-gray-400">Selected Prop Firm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Size Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Account Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propFirm.rules.accountSizes.map((size, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25'
                      : 'border-gray-700 bg-gray-800/60 hover:border-gray-600'
                  }`}
                >
                  {selectedSize === size && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${size.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm mb-4">Account Size</div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Profit Target:</span>
                        <span className="text-green-400">
                          ${(size * propFirm.rules.profitTarget / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Loss Limit:</span>
                        <span className="text-red-400">
                          ${(size * propFirm.rules.dailyLoss / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Drawdown:</span>
                        <span className="text-red-400">
                          ${(size * propFirm.rules.maxDrawdown / 100).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge Type Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Challenge Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propFirm.rules.challengeTypes.map((type, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedType(type)}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                    selectedType === type
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25'
                      : 'border-gray-700 bg-gray-800/60 hover:border-gray-600'
                  }`}
                >
                  {selectedType === type && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 capitalize">
                      {type.replace('-', ' ')} Challenge
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {getChallengeTypeDescription(type)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {getChallengeTypeFeatures(type).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Summary */}
          {selectedSize && selectedType && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Configuration Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    ${selectedSize.toLocaleString()}
                  </div>
                  <div className="text-gray-400">Account Size</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2 capitalize">
                    {selectedType.replace('-', ' ')}
                  </div>
                  <div className="text-gray-400">Challenge Type</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ${(selectedSize * propFirm.rules.profitTarget / 100).toLocaleString()}
                  </div>
                  <div className="text-gray-400">Profit Target</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/setup/prop-firm')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Prop Firm</span>
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!selectedSize || !selectedType}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedSize && selectedType
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

export default AccountConfiguration;