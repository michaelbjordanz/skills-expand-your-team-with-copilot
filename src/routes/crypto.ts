import { Router } from 'express';
import { CryptoService } from '../services/cryptoService';

const router = Router();
const cryptoService = new CryptoService();

// Get market data
router.get('/market', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const marketData = await cryptoService.getMarketData(limit);
    
    return res.json({
      success: true,
      data: marketData,
      count: marketData.length
    });
  } catch (error) {
    return next(error);
  }
});

// Get specific coin price
router.get('/price/:coinId', async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const coinData = await cryptoService.getCoinPrice(coinId);
    
    return res.json({
      success: true,
      data: coinData
    });
  } catch (error) {
    return next(error);
  }
});

// Get trending coins
router.get('/trending', async (req, res, next) => {
  try {
    const trendingData = await cryptoService.getTrendingCoins();
    
    return res.json({
      success: true,
      data: trendingData
    });
  } catch (error) {
    return next(error);
  }
});

// Buy cryptocurrency
router.post('/buy', async (req, res, next) => {
  try {
    const { userId, symbol, amountUSD } = req.body;
    
    if (!userId || !symbol || !amountUSD) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, symbol, amountUSD'
      });
    }

    const order = await cryptoService.buyCrypto(userId, symbol, amountUSD);
    
    return res.json({
      success: true,
      order
    });
  } catch (error) {
    return next(error);
  }
});

// Sell cryptocurrency
router.post('/sell', async (req, res, next) => {
  try {
    const { userId, symbol, cryptoAmount } = req.body;
    
    if (!userId || !symbol || !cryptoAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, symbol, cryptoAmount'
      });
    }

    const order = await cryptoService.sellCrypto(userId, symbol, cryptoAmount);
    
    return res.json({
      success: true,
      order
    });
  } catch (error) {
    return next(error);
  }
});

// Get user portfolio
router.get('/portfolio/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const portfolio = await cryptoService.getPortfolio(userId);
    
    return res.json({
      success: true,
      portfolio
    });
  } catch (error) {
    return next(error);
  }
});

// Set price alert
router.post('/alerts', async (req, res, next) => {
  try {
    const { userId, symbol, targetPrice, type } = req.body;
    
    if (!userId || !symbol || !targetPrice || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, symbol, targetPrice, type'
      });
    }

    const result = await cryptoService.setPriceAlert(userId, symbol, targetPrice, type);
    
    return res.json({
      success: result,
      message: result ? 'Price alert set successfully' : 'Failed to set price alert'
    });
  } catch (error) {
    return next(error);
  }
});

// Get historical data
router.get('/history/:coinId', async (req, res, next) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    
    const historicalData = await cryptoService.getHistoricalData(coinId, days);
    
    return res.json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    return next(error);
  }
});

export default router;