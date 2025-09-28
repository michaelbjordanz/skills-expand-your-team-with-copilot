import { Router } from 'express';
import { Web5Service, UserProfile } from '../services/web5Service';

const router = Router();
const web5Service = new Web5Service();

// Initialize Web5 connection
router.post('/connect', async (req, res, next) => {
  try {
    const result = await web5Service.initialize();
    
    return res.json({
      success: true,
      message: 'Web5 connected successfully',
      did: result.did
    });
  } catch (error) {
    return next(error);
  }
});

// Create user profile
router.post('/profile', async (req, res, next) => {
  try {
    const profileData = req.body;
    
    if (!profileData.name || !profileData.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email'
      });
    }

    const profile = await web5Service.createUserProfile(profileData);
    
    return res.json({
      success: true,
      profile
    });
  } catch (error) {
    return next(error);
  }
});

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await web5Service.getUserProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.json({
      success: true,
      profile
    });
  } catch (error) {
    return next(error);
  }
});

// Record a payment
router.post('/payments', async (req, res, next) => {
  try {
    const paymentData = req.body;
    
    if (!paymentData.from || !paymentData.to || !paymentData.amount || !paymentData.currency) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: from, to, amount, currency'
      });
    }

    const payment = await web5Service.recordPayment(paymentData);
    
    return res.json({
      success: true,
      payment
    });
  } catch (error) {
    return next(error);
  }
});

// Get payment history
router.get('/payments', async (req, res, next) => {
  try {
    const payments = await web5Service.getPaymentHistory();
    
    return res.json({
      success: true,
      payments,
      count: payments.length
    });
  } catch (error) {
    return next(error);
  }
});

// Create a new DID
router.post('/did', async (req, res, next) => {
  try {
    const { method } = req.body;
    
    if (method && !['ion', 'dht', 'jwk', 'key'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid DID method. Supported: ion, dht, jwk, key'
      });
    }

    const did = await web5Service.createDID(method);
    
    return res.json({
      success: true,
      did,
      method: method || 'ion'
    });
  } catch (error) {
    return next(error);
  }
});

// Get current DID
router.get('/did', async (req, res, next) => {
  try {
    const did = web5Service.getDid();
    
    if (!did) {
      return res.status(404).json({
        success: false,
        message: 'No DID found. Connect to Web5 first.'
      });
    }

    return res.json({
      success: true,
      did
    });
  } catch (error) {
    return next(error);
  }
});

// Web5 health check
router.get('/health', async (req, res, next) => {
  try {
    const web5Instance = web5Service.getWeb5Instance();
    const did = web5Service.getDid();
    
    return res.json({
      success: true,
      status: 'connected',
      hasWeb5Instance: !!web5Instance,
      did: did || null,
      message: 'Web5 service is operational'
    });
  } catch (error) {
    return next(error);
  }
});

export default router;