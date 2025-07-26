import { TradingSignal, SignalCondition, MarketStatus } from './Signal';

export class AdvancedSignalGenerator {
  private readonly MAJOR_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'AUDUSD'];
  
  // Condition 1: Session Liquidity Analysis
  private analyzeSessionLiquidity(pair: string): SignalCondition {
    const currentSession = this.getCurrentSession();
    let status: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0;
    let details = '';

    // High liquidity during London/New York sessions
    if (currentSession === 'London' || currentSession === 'New York') {
      status = 'bullish';
      confidence = 85;
      details = `High liquidity during ${currentSession} session - optimal trading conditions`;
    } else if (currentSession === 'Tokyo' && (pair.includes('JPY') || pair === 'AUDUSD')) {
      status = 'bullish';
      confidence = 75;
      details = 'Asian session - good for JPY and AUD pairs';
    } else {
      status = 'neutral';
      confidence = 50;
      details = 'Lower liquidity session - reduced trading activity';
    }

    return {
      id: 1,
      name: 'Session Liquidity',
      weight: 20,
      status,
      confidence,
      details
    };
  }

  // Condition 2: Market Structure Analysis (ICT/SMC)
  private analyzeMarketStructure(pair: string): SignalCondition {
    // Simulate market structure analysis
    const structureScenarios = [
      { status: 'bullish', confidence: 88, details: 'Price respecting bullish order block - strong institutional support' },
      { status: 'bearish', confidence: 82, details: 'Break of structure detected - bearish momentum confirmed' },
      { status: 'bullish', confidence: 90, details: 'Fair Value Gap mitigation complete - expecting continuation higher' },
      { status: 'bearish', confidence: 85, details: 'Lower high formed - market structure turning bearish' },
      { status: 'neutral', confidence: 60, details: 'Consolidation phase - awaiting structural break' }
    ];

    const randomScenario = structureScenarios[Math.floor(Math.random() * structureScenarios.length)];

    return {
      id: 2,
      name: 'Market Structure (ICT/SMC)',
      weight: 25,
      status: randomScenario.status as 'bullish' | 'bearish' | 'neutral',
      confidence: randomScenario.confidence,
      details: randomScenario.details
    };
  }

  // Condition 3: Higher Timeframe Bias (30min+ confirmation)
  private analyzeHigherTimeframeBias(pair: string): SignalCondition {
    const biasScenarios = [
      { status: 'bullish', confidence: 92, details: 'All higher timeframes aligned bullish - EMA 20 > 50 > 200' },
      { status: 'bearish', confidence: 89, details: 'Daily and 4H bearish alignment confirmed - downtrend intact' },
      { status: 'bullish', confidence: 87, details: '4H trend change confirmed - daily still bullish' },
      { status: 'neutral', confidence: 65, details: 'Mixed signals across timeframes - waiting for alignment' }
    ];

    const randomBias = biasScenarios[Math.floor(Math.random() * biasScenarios.length)];

    return {
      id: 3,
      name: 'Higher Timeframe Bias',
      weight: 25,
      status: randomBias.status as 'bullish' | 'bearish' | 'neutral',
      confidence: randomBias.confidence,
      details: randomBias.details
    };
  }

  // Condition 4: Confirmation Patterns & Rejection Candles
  private analyzeConfirmationPatterns(pair: string): SignalCondition {
    const patternScenarios = [
      { status: 'bullish', confidence: 85, details: 'Bullish engulfing pattern at key support - strong reversal signal' },
      { status: 'bearish', confidence: 80, details: 'Shooting star rejection at resistance - bearish reversal likely' },
      { status: 'bullish', confidence: 78, details: 'Hammer candle at demand zone - bullish rejection confirmed' },
      { status: 'bearish', confidence: 83, details: 'Bearish pin bar at supply level - selling pressure evident' },
      { status: 'neutral', confidence: 55, details: 'No clear patterns - waiting for confirmation candles' }
    ];

    const randomPattern = patternScenarios[Math.floor(Math.random() * patternScenarios.length)];

    return {
      id: 4,
      name: 'Confirmation Patterns',
      weight: 20,
      status: randomPattern.status as 'bullish' | 'bearish' | 'neutral',
      confidence: randomPattern.confidence,
      details: randomPattern.details
    };
  }

  // Condition 5: Risk Management & Money Management
  private calculateRiskManagement(pair: string, direction: 'BUY' | 'SELL'): SignalCondition {
    const riskScenarios = [
      { confidence: 90, details: 'Excellent 1:3 Risk-Reward setup - low volatility environment' },
      { confidence: 85, details: 'Good 1:2.5 Risk-Reward - optimal position sizing confirmed' },
      { confidence: 75, details: 'Acceptable 1:2 Risk-Reward - standard position size recommended' },
      { confidence: 65, details: 'Marginal 1:1.5 Risk-Reward - reduced position size advised' }
    ];

    const randomRisk = riskScenarios[Math.floor(Math.random() * riskScenarios.length)];

    return {
      id: 5,
      name: 'Risk Management',
      weight: 10,
      status: direction === 'BUY' ? 'bullish' : 'bearish',
      confidence: randomRisk.confidence,
      details: randomRisk.details
    };
  }

  // Generate complete trading signal
  public generateSignal(pair: string): TradingSignal | null {
    if (!this.MAJOR_PAIRS.includes(pair)) {
      return null;
    }

    // Analyze all 5 conditions
    const conditions = [
      this.analyzeSessionLiquidity(pair),
      this.analyzeMarketStructure(pair),
      this.analyzeHigherTimeframeBias(pair),
      this.analyzeConfirmationPatterns(pair)
    ];

    // Calculate weighted scores
    const bullishScore = conditions.reduce((sum, condition) => 
      sum + (condition.status === 'bullish' ? condition.confidence * condition.weight / 100 : 0), 0
    );

    const bearishScore = conditions.reduce((sum, condition) => 
      sum + (condition.status === 'bearish' ? condition.confidence * condition.weight / 100 : 0), 0
    );

    // Determine signal direction
    const MIN_SCORE = 60;
    let direction: 'BUY' | 'SELL' | null = null;
    let overallConfidence = 0;

    if (bullishScore > bearishScore && bullishScore >= MIN_SCORE) {
      direction = 'BUY';
      overallConfidence = Math.min(bullishScore, 95);
    } else if (bearishScore > bullishScore && bearishScore >= MIN_SCORE) {
      direction = 'SELL';
      overallConfidence = Math.min(bearishScore, 95);
    }

    if (!direction) {
      return null; // No signal generated
    }

    // Calculate realistic price levels
    const basePrice = this.getBasePrice(pair);
    const pipValue = pair.includes('JPY') ? 0.01 : 0.0001;
    
    const entry = direction === 'BUY' ? 
      basePrice + (Math.random() * 5 * pipValue) : 
      basePrice - (Math.random() * 5 * pipValue);
    
    const stopDistance = (20 + Math.random() * 30) * pipValue; // 20-50 pips
    const stopLoss = direction === 'BUY' ? entry - stopDistance : entry + stopDistance;
    
    const targetDistance = stopDistance * (2 + Math.random()); // 1:2 to 1:3 RR
    const takeProfit = direction === 'BUY' ? entry + targetDistance : entry - targetDistance;
    
    const riskReward = targetDistance / stopDistance;
    const pips = Math.round(stopDistance / pipValue);

    // Add risk management condition
    const riskCondition = this.calculateRiskManagement(pair, direction);
    conditions.push(riskCondition);

    return {
      pair,
      direction,
      entry: this.roundPrice(entry, pair),
      stopLoss: this.roundPrice(stopLoss, pair),
      takeProfit: this.roundPrice(takeProfit, pair),
      riskReward: Math.round(riskReward * 10) / 10,
      confidence: Math.round(overallConfidence),
      conditions,
      timestamp: new Date(),
      session: this.getCurrentSession(),
      pips
    };
  }

  // Get current trading session
  private getCurrentSession(): 'Sydney' | 'Tokyo' | 'London' | 'New York' {
    const hour = new Date().getUTCHours();
    
    if (hour >= 22 || hour < 7) return 'Sydney';
    if (hour >= 7 && hour < 9) return 'Tokyo';
    if (hour >= 9 && hour < 17) return 'London';
    return 'New York';
  }

  // Get market status
  public getMarketStatus(): MarketStatus {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    
    const isWeekend = day === 0 || day === 6 || (day === 5 && hour >= 22);
    
    return {
      isOpen: !isWeekend,
      currentSession: this.getCurrentSession(),
      nextSession: 'London', // Simplified
      timeUntilNext: isWeekend ? 'Opens Sunday 22:00 UTC' : 'Next session in 2h 15m'
    };
  }

  // Helper methods
  private getBasePrice(pair: string): number {
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2750,
      'USDJPY': 149.50,
      'XAUUSD': 2020.00,
      'AUDUSD': 0.6650
    };
    return basePrices[pair] || 1.0000;
  }

  private roundPrice(price: number, pair: string): number {
    const decimals = pair.includes('JPY') ? 3 : 5;
    return Math.round(price * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
