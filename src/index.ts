import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import paymentRoutes from './routes/payments';
import cardRoutes from './routes/cards';
import cryptoRoutes from './routes/crypto';
import web5Routes from './routes/web5';
import terminalRoutes from './routes/terminal';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

// Load environment variables
dotenv.config();

class Web5FintechApp {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(logger);
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      return res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
          web5: 'available',
          payments: 'available',
          crypto: 'available',
          cards: 'available',
          terminal: 'available'
        }
      });
    });

    // API routes
    this.app.use('/api/payments', paymentRoutes);
    this.app.use('/api/cards', cardRoutes);
    this.app.use('/api/crypto', cryptoRoutes);
    this.app.use('/api/web5', web5Routes);
    this.app.use('/api/terminal', terminalRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      return res.json({
        name: 'Web5 Omni Fintech Platform',
        version: '1.0.0',
        description: 'A comprehensive Web5-based fintech platform with crypto, card issuing, and payment processing capabilities',
        endpoints: [
          '/api/payments',
          '/api/cards', 
          '/api/crypto',
          '/api/web5',
          '/api/terminal',
          '/health'
        ]
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Try to initialize Web5 connection, but don't fail if it's not available
      console.log('🚀 Starting Web5 Fintech Platform...');
      
      try {
        // Import Web5 dynamically to handle potential connection issues
        const { Web5 } = await import('@web5/api');
        const { web5, did } = await Web5.connect();
        console.log(`✅ Web5 connected with DID: ${did}`);
      } catch (web5Error) {
        console.log('⚠️  Web5 connection not available (running in fallback mode)');
        console.log('   Web5 features will use mock data');
      }

      // Start server
      this.app.listen(this.port, () => {
        console.log(`🌐 Web5 Fintech Platform running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API endpoints: http://localhost:${this.port}/api`);
        console.log(`📖 Documentation: See README.md for full API reference`);
      });
    } catch (error) {
      console.error('❌ Failed to start Web5 Fintech Platform:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new Web5FintechApp();
app.start().catch(console.error);

export default Web5FintechApp;