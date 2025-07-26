export interface SignalCondition {
  id: number;
  name: string;
  weight: number;
  status: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  details: string;
}

export interface TradingSignal {
  pair: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  confidence: number;
  conditions: SignalCondition[];
  timestamp: Date;
  session: 'Sydney' | 'Tokyo' | 'London' | 'New York';
  pips: number;
}

export interface MarketStatus {
  isOpen: boolean;
  currentSession: string;
  nextSession: string;
  timeUntilNext: string;
}
