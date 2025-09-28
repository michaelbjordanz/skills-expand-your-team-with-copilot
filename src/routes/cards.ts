import { Router } from 'express';
import { CardService, CardApplication } from '../services/cardService';

const router = Router();
const cardService = new CardService();

// Apply for a new card
router.post('/apply', async (req, res, next) => {
  try {
    const application: CardApplication = req.body;
    
    // Basic validation
    if (!application.userId || !application.cardType || !application.applicantInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required application information'
      });
    }

    const result = await cardService.applyForCard(application);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// Issue a card (after approval)
router.post('/issue', async (req, res, next) => {
  try {
    const { applicationId, cardType, network } = req.body;
    
    if (!applicationId || !cardType || !network) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: applicationId, cardType, network'
      });
    }

    const card = await cardService.issueCard(applicationId, cardType, network);
    
    return res.json({
      success: true,
      card
    });
  } catch (error) {
    return next(error);
  }
});

// Get card details
router.get('/:cardId', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await cardService.getCard(cardId);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    return res.json({
      success: true,
      card
    });
  } catch (error) {
    return next(error);
  }
});

// Get card transactions
router.get('/:cardId/transactions', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const transactions = await cardService.getCardTransactions(cardId, limit);
    
    return res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (error) {
    return next(error);
  }
});

// Block/Unblock card
router.patch('/:cardId/status', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { action } = req.body;
    
    if (!action || !['block', 'unblock'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "block" or "unblock"'
      });
    }

    const result = await cardService.toggleCardStatus(cardId, action);
    
    return res.json({
      success: result,
      message: result ? `Card ${action}ed successfully` : `Failed to ${action} card`
    });
  } catch (error) {
    return next(error);
  }
});

// Set card controls
router.put('/:cardId/controls', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const controls = req.body;
    
    const result = await cardService.setCardControls(cardId, controls);
    
    return res.json({
      success: result,
      message: result ? 'Card controls updated successfully' : 'Failed to update card controls'
    });
  } catch (error) {
    return next(error);
  }
});

// Add funds to prepaid card
router.post('/:cardId/add-funds', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const result = await cardService.addFunds(cardId, amount);
    
    return res.json({
      success: result,
      message: result ? `$${amount} added successfully` : 'Failed to add funds'
    });
  } catch (error) {
    return next(error);
  }
});

// Get spending analytics
router.get('/:cardId/analytics', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const period = (req.query.period as string) || 'month';
    
    if (!['month', 'quarter', 'year'].includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Use "month", "quarter", or "year"'
      });
    }

    const analytics = await cardService.getSpendingAnalytics(cardId, period as any);
    
    return res.json({
      success: true,
      analytics
    });
  } catch (error) {
    return next(error);
  }
});

export default router;