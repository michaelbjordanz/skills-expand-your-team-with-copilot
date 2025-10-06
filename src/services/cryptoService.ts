import axios from 'axios';

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  last_updated: string;
}

export interface CryptoPortfolio {
  userId: string;
  holdings: CryptoHolding[];
  totalValue: number;
  totalPnL: number;
  lastUpdated: string;
}

export interface CryptoHolding {
  symbol: string;
  amount: number;
  avgPurchasePrice: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface TradeOrder {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: string;
}

export class CryptoService {
  private readonly baseUrl = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';
  private readonly apiKey = process.env.COINGECKO_API_KEY;

  // Get market data for top cryptocurrencies
  async getMarketData(limit: number = 50): Promise<CryptoCurrency[]> {
    try {
      console.log('📈 Fetching crypto market data from CoinGecko...');
      
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false
        },
        headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
      });

      console.log(`✅ Retrieved ${response.data.length} crypto currencies`);
      return response.data as CryptoCurrency[];
    } catch (error) {
      console.error('❌ Failed to fetch crypto market data:', error);
      throw new Error('Unable to fetch cryptocurrency market data');
    }
  }

  // Get specific coin price and details
  async getCoinPrice(coinId: string): Promise<CryptoCurrency> {
    try {
      console.log(`💰 Fetching price for ${coinId}...`);
      
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coinId
        },
        headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
      });

      if (response.data.length === 0) {
        throw new Error(`Coin ${coinId} not found`);
      }

      return response.data[0] as CryptoCurrency;
    } catch (error) {
      console.error(`❌ Failed to fetch price for ${coinId}:`, error);
      throw error;
    }
  }

  // Get trending cryptocurrencies
  async getTrendingCoins(): Promise<any> {
    try {
      console.log('🔥 Fetching trending cryptocurrencies...');
      
      const response = await axios.get(`${this.baseUrl}/search/trending`, {
        headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch trending coins:', error);
      throw error;
    }
  }

  // Simulate crypto trading (buy order)
  async buyCrypto(userId: string, symbol: string, amountUSD: number): Promise<TradeOrder> {
    try {
      console.log(`💳 Processing buy order: ${symbol} for $${amountUSD}`);
      
      // Get current price
      const coinData = await this.getCoinPrice(symbol.toLowerCase());
      const cryptoAmount = amountUSD / coinData.current_price;
      
      const order: TradeOrder = {
        id: this.generateOrderId(),
        userId,
        type: 'buy',
        symbol: symbol.toUpperCase(),
        amount: cryptoAmount,
        price: coinData.current_price,
        total: amountUSD,
        status: 'filled',
        timestamp: new Date().toISOString()
      };

      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ Buy order filled: ${cryptoAmount.toFixed(8)} ${symbol} @ $${coinData.current_price}`);
      return order;
    } catch (error) {
      console.error('❌ Buy order failed:', error);
      throw error;
    }
  }

  // Simulate crypto trading (sell order)
  async sellCrypto(userId: string, symbol: string, cryptoAmount: number): Promise<TradeOrder> {
    try {
      console.log(`💸 Processing sell order: ${cryptoAmount} ${symbol}`);
      
      // Get current price
      const coinData = await this.getCoinPrice(symbol.toLowerCase());
      const usdAmount = cryptoAmount * coinData.current_price;
      
      const order: TradeOrder = {
        id: this.generateOrderId(),
        userId,
        type: 'sell',
        symbol: symbol.toUpperCase(),
        amount: cryptoAmount,
        price: coinData.current_price,
        total: usdAmount,
        status: 'filled',
        timestamp: new Date().toISOString()
      };

      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ Sell order filled: ${cryptoAmount} ${symbol} for $${usdAmount.toFixed(2)}`);
      return order;
    } catch (error) {
      console.error('❌ Sell order failed:', error);
      throw error;
    }
  }

  // Get user's crypto portfolio (simulated)
  async getPortfolio(userId: string): Promise<CryptoPortfolio> {
    try {
      console.log(`📊 Fetching portfolio for user ${userId}...`);
      
      // Simulate portfolio data
      const mockHoldings: CryptoHolding[] = [
        {
          symbol: 'BTC',
          amount: 0.5,
          avgPurchasePrice: 45000,
          currentPrice: 0,
          currentValue: 0,
          pnl: 0,
          pnlPercentage: 0
        },
        {
          symbol: 'ETH',
          amount: 2.5,
          avgPurchasePrice: 3200,
          currentPrice: 0,
          currentValue: 0,
          pnl: 0,
          pnlPercentage: 0
        }
      ];

      // Update with current prices
      let totalValue = 0;
      let totalPnL = 0;

      for (const holding of mockHoldings) {
        const coinData = await this.getCoinPrice(holding.symbol.toLowerCase());
        holding.currentPrice = coinData.current_price;
        holding.currentValue = holding.amount * holding.currentPrice;
        holding.pnl = holding.currentValue - (holding.amount * holding.avgPurchasePrice);
        holding.pnlPercentage = (holding.pnl / (holding.amount * holding.avgPurchasePrice)) * 100;
        
        totalValue += holding.currentValue;
        totalPnL += holding.pnl;
      }

      const portfolio: CryptoPortfolio = {
        userId,
        holdings: mockHoldings,
        totalValue,
        totalPnL,
        lastUpdated: new Date().toISOString()
      };

      console.log(`✅ Portfolio value: $${totalValue.toFixed(2)} (PnL: ${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)})`);
      return portfolio;
    } catch (error) {
      console.error('❌ Failed to fetch portfolio:', error);
      throw error;
    }
  }

  // Get price alerts (simulated)
  async setPriceAlert(userId: string, symbol: string, targetPrice: number, type: 'above' | 'below'): Promise<boolean> {
    try {
      console.log(`🚨 Setting price alert: ${symbol} ${type} $${targetPrice}`);
      
      // Simulate setting price alert
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Price alert set for ${symbol}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to set price alert:', error);
      return false;
    }
  }

  // Get historical price data
  async getHistoricalData(coinId: string, days: number = 7): Promise<any> {
    try {
      console.log(`📈 Fetching ${days} days of historical data for ${coinId}...`);
      
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days
        },
        headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch historical data for ${coinId}:`, error);
      throw error;
    }
  }

  private generateOrderId(): string {
    return 'order_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}