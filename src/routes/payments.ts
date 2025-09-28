import { Router } from 'express';
import { PaymentService, PaymentRequest } from '../services/paymentService';

const router = Router();
const paymentService = new PaymentService();

// Process payment
router.post('/process', async (req, res, next) => {
  try {
    const paymentRequest: PaymentRequest = req.body;
    
    // Validate request
    if (!paymentRequest.amount || !paymentRequest.currency || !paymentRequest.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, currency, paymentMethod'
      });
    }

    const result = await paymentService.processPayment(paymentRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// Get Plaid bank accounts
router.get('/plaid/accounts/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const accounts = await paymentService.getPlaidBankAccounts(userId);
    
    return res.json({
      success: true,
      accounts
    });
  } catch (error) {
    return next(error);
  }
});

// Process Mastercard payment
router.post('/mastercard', async (req, res, next) => {
  try {
    const paymentRequest: PaymentRequest = { ...req.body, paymentMethod: 'mastercard' };
    const result = await paymentService.processMastercardPayment(paymentRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// Process PayPal payment
router.post('/paypal', async (req, res, next) => {
  try {
    const paymentRequest: PaymentRequest = { ...req.body, paymentMethod: 'paypal' };
    const result = await paymentService.processPayPalPayment(paymentRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// Process Braintree payment
router.post('/braintree', async (req, res, next) => {
  try {
    const paymentRequest: PaymentRequest = { ...req.body, paymentMethod: 'braintree' };
    const result = await paymentService.processBraintreePayment(paymentRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

// Process Plaid/ACH payment
router.post('/plaid', async (req, res, next) => {
  try {
    const paymentRequest: PaymentRequest = { ...req.body, paymentMethod: 'plaid' };
    const result = await paymentService.processPlaidPayment(paymentRequest);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;