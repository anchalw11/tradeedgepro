import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PropFirm {
  name: string;
  logo: string;
  description: string;
  rules: {
    dailyLoss: number;
    maxDrawdown: number;
    profitTarget: number;
    minTradingDays: number;
    maxPositionSize: number;
    scalingTarget: number;
    challengeTypes: string[];
    accountSizes: number[];
    overnightPositions?: boolean;
    newsTrading?: boolean;
    weekendHolding?: boolean;
    consistencyRule?: boolean;
  };
  popular?: boolean;
}

interface AccountConfig {
  size: number;
  challengeType: string;
}

interface RiskConfig {
  riskPercentage: number;
  riskRewardRatio: number;
}

interface TradingPlan {
  trades: Array<{
    id: number;
    risk: number;
    reward: number;
    timeframe: string;
    expectedReturn: number;
    pairs: string[];
    lotSize: number;
    stopLoss: number;
    takeProfit: number;
  }>;
  timeline: {
    phase1: number;
    phase2: number;
    total: number;
  };
  targets: {
    phase1Return: number;
    phase2Return: number;
    totalTarget: number;
    monthlyEarnings: number;
  };
}

interface TradingPlanContextType {
  propFirm: PropFirm | null;
  accountConfig: AccountConfig | null;
  riskConfig: RiskConfig | null;
  tradingPlan: TradingPlan | null;
  updatePropFirm: (firm: PropFirm) => void;
  updateAccountConfig: (config: AccountConfig) => void;
  updateRiskConfig: (config: RiskConfig) => void;
  updateTradingPlan: (plan: TradingPlan) => void;
  resetPlan: () => void;
}

const TradingPlanContext = createContext<TradingPlanContextType | undefined>(undefined);

export const TradingPlanProvider = ({ children }: { children: ReactNode }) => {
  const [propFirm, setPropFirm] = useState<PropFirm | null>(null);
  const [accountConfig, setAccountConfig] = useState<AccountConfig | null>(null);
  const [riskConfig, setRiskConfig] = useState<RiskConfig | null>(null);
  const [tradingPlan, setTradingPlan] = useState<TradingPlan | null>(null);

  const updatePropFirm = (firm: PropFirm) => {
    setPropFirm(firm);
  };

  const updateAccountConfig = (config: AccountConfig) => {
    setAccountConfig(config);
  };

  const updateRiskConfig = (config: RiskConfig) => {
    setRiskConfig(config);
  };

  const updateTradingPlan = (plan: TradingPlan) => {
    setTradingPlan(plan);
  };

  const resetPlan = () => {
    setPropFirm(null);
    setAccountConfig(null);
    setRiskConfig(null);
    setTradingPlan(null);
  };

  return (
    <TradingPlanContext.Provider value={{
      propFirm,
      accountConfig,
      riskConfig,
      tradingPlan,
      updatePropFirm,
      updateAccountConfig,
      updateRiskConfig,
      updateTradingPlan,
      resetPlan
    }}>
      {children}
    </TradingPlanContext.Provider>
  );
};

export const useTradingPlan = () => {
  const context = useContext(TradingPlanContext);
  if (context === undefined) {
    throw new Error('useTradingPlan must be used within a TradingPlanProvider');
  }
  return context;
};
