import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface PersonalizedSignal {
  userId: string;
  userName: string;
  originalSignal: any;
  personalizedEntry: string;
  personalizedStopLoss: string;
  personalizedTakeProfit: string[];
  positionSize: string;
  riskAmount: number;
  rewardAmount: number;
  pipsAtRisk: number;
  timestamp: Date;
}

interface SignalDistributionContextType {
  distributeSignal: (signal: any, users: User[]) => PersonalizedSignal[];
  getPersonalizedSignals: (userId: string) => PersonalizedSignal[];
  allPersonalizedSignals: PersonalizedSignal[];
}

const SignalDistributionContext = createContext<SignalDistributionContextType | undefined>(undefined);

export const SignalDistributionProvider = ({ children }: { children: ReactNode }) => {
  const [allPersonalizedSignals, setAllPersonalizedSignals] = useState<PersonalizedSignal[]>([]);

  const calculatePersonalizedSignal = (signal: any, user: User): PersonalizedSignal => {
    // Calculate risk amount based on user's risk percentage
    const riskAmount = user.accountSize * (user.riskPercentage / 100);
    
    // Calculate position size based on stop loss distance
    const entryPrice = parseFloat(signal.entry);
    const stopLossPrice = parseFloat(signal.stopLoss);
    const pipValue = signal.pair.includes('JPY') ? 0.01 : 0.0001;
    const pipsAtRisk = Math.abs(entryPrice - stopLossPrice) / pipValue;
    
    // Calculate position size (simplified calculation)
    const dollarPerPip = 1; // This would be more complex in reality
    const positionSize = pipsAtRisk > 0 ? (riskAmount / (pipsAtRisk * dollarPerPip)).toFixed(2) : '0.00';
    
    // Calculate reward amount based on user's risk-reward ratio
    const rewardAmount = riskAmount * user.riskRewardRatio;
    
    // Adjust take profit based on user's risk-reward preference
    const takeProfitDistance = Math.abs(entryPrice - stopLossPrice) * user.riskRewardRatio;
    const personalizedTakeProfit = signal.direction === 'BUY' 
      ? (entryPrice + takeProfitDistance).toFixed(5)
      : (entryPrice - takeProfitDistance).toFixed(5);

    // For conservative users, adjust entry slightly for better fills
    let personalizedEntry = signal.entry;
    if (user.riskPercentage <= 0.5) {
      const adjustment = pipValue * 2; // 2 pip adjustment for conservative users
      personalizedEntry = signal.direction === 'BUY'
        ? (entryPrice - adjustment).toFixed(5)
        : (entryPrice + adjustment).toFixed(5);
    }

    return {
      userId: user.id,
      userName: user.name,
      originalSignal: signal,
      personalizedEntry,
      personalizedStopLoss: signal.stopLoss,
      personalizedTakeProfit: [personalizedTakeProfit, ...signal.takeProfit.slice(1)],
      positionSize,
      riskAmount,
      rewardAmount,
      pipsAtRisk: Math.round(pipsAtRisk),
      timestamp: new Date()
    };
  };

  const distributeSignal = (signal: any, users: User[]): PersonalizedSignal[] => {
    const personalizedSignals = users
      .filter(user => user.isActive)
      .map(user => calculatePersonalizedSignal(signal, user));

    // Store all personalized signals
    setAllPersonalizedSignals(prev => [...personalizedSignals, ...prev]);

    // In a real application, you would send these to each user via:
    // - Email notifications
    // - Push notifications
    // - In-app notifications
    // - Telegram/Discord bots
    // - SMS alerts
    // - Trading platform APIs

    console.log('📡 Signal Distribution Complete:', {
      originalSignal: signal,
      totalUsers: personalizedSignals.length,
      personalizedSignals
    });

    return personalizedSignals;
  };

  const getPersonalizedSignals = (userId: string): PersonalizedSignal[] => {
    return allPersonalizedSignals.filter(signal => signal.userId === userId);
  };

  return (
    <SignalDistributionContext.Provider value={{
      distributeSignal,
      getPersonalizedSignals,
      allPersonalizedSignals
    }}>
      {children}
    </SignalDistributionContext.Provider>
  );
};

export const useSignalDistribution = () => {
  const context = useContext(SignalDistributionContext);
  if (context === undefined) {
    throw new Error('useSignalDistribution must be used within a SignalDistributionProvider');
  }
  return context;
};