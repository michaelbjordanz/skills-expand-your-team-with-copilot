# Web5 Omni Fintech Platform

A comprehensive Web5-based fintech platform integrating modern payment processing, cryptocurrency trading, card issuing, and decentralized identity management.

## 🚀 Features

### 🌐 Web5 Integration
- **Decentralized Identity (DID)**: Support for ION, DHT, JWK, and Key DID methods
- **Self-Sovereign Identity (SSI)**: User-controlled identity and data
- **Decentralized Web Node (DWN)**: Secure data storage and synchronization
- **Verifiable Credentials**: Support for digital credentials and attestations

### 💳 Payment Processing
- **Multiple Payment Methods**: Mastercard, PayPal, Braintree, Plaid/ACH
- **Real-time Processing**: Instant payment validation and processing
- **Fee Transparency**: Clear fee structure for each payment method
- **Bank Account Integration**: Connect and manage bank accounts via Plaid

### 🎴 Card Issuing & Management
- **Debit/Credit/Prepaid Cards**: Full card lifecycle management
- **Multi-Network Support**: Mastercard and Visa integration
- **Real-time Controls**: Set spending limits, merchant restrictions
- **Transaction Analytics**: Detailed spending insights and categorization
- **Instant Card Actions**: Block/unblock cards instantly

### ₿ Cryptocurrency Trading
- **CoinGecko Integration**: Real-time crypto market data
- **Buy/Sell Orders**: Simulate crypto trading with current prices
- **Portfolio Management**: Track holdings, P&L, and performance
- **Price Alerts**: Set custom price notifications
- **Market Analytics**: Historical data and trending coins

### 🔧 Automation & Integration
- **n8n Workflows**: Pre-built payment processing workflows
- **Terminal/CLI Interface**: Command-line tools for all operations
- **VTAP Support**: Virtual Terminal Application Protocol
- **Webhook Integration**: Real-time event notifications

## 🛠 Technology Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Web5**: @web5/api, @web5/dids, @web5/credentials
- **Payment APIs**: Mastercard, PayPal, Braintree, Plaid
- **Crypto Data**: CoinGecko API
- **Automation**: n8n workflow engine
- **Security**: Helmet, CORS, JWT authentication

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone https://github.com/michaelbjordanz/skills-expand-your-team-with-copilot.git
cd skills-expand-your-team-with-copilot

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your API keys and configuration
nano .env

# Start the development server
npm run dev
```

### Environment Configuration
Configure the following services in your `.env` file:

```bash
# Web5 Configuration
WEB5_DWN_ENDPOINT=https://dwn.tbddev.org/beta

# Payment Processing API Keys
MASTERCARD_API_KEY=your_mastercard_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
PLAID_CLIENT_ID=your_plaid_client_id

# Crypto & Trading
COINGECKO_API_KEY=your_coingecko_api_key

# Application Settings
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
```

## 🖥 CLI Usage

The platform includes a powerful command-line interface:

```bash
# Make CLI executable
chmod +x cli/web5-fintech-cli.js

# Run CLI
node cli/web5-fintech-cli.js

# Available commands:
web5-fintech> balance                    # Check all balances
web5-fintech> pay 100 USD mastercard     # Process payment
web5-fintech> crypto price bitcoin       # Get crypto price
web5-fintech> crypto buy bitcoin 500     # Buy $500 of Bitcoin
web5-fintech> card list                  # List all cards
web5-fintech> web5 connect              # Connect to Web5
web5-fintech> help                      # Show all commands
```

## 🔗 API Endpoints

### Health Check
```
GET /health - System health status
GET / - API information and endpoints
```

### Payment Processing
```
POST /api/payments/process - Process payment with any method
POST /api/payments/mastercard - Mastercard payment
POST /api/payments/paypal - PayPal payment
POST /api/payments/braintree - Braintree payment
POST /api/payments/plaid - Plaid/ACH payment
GET /api/payments/plaid/accounts/:userId - Get linked bank accounts
```

### Cryptocurrency
```
GET /api/crypto/market - Get market data
GET /api/crypto/price/:coinId - Get specific coin price
GET /api/crypto/trending - Get trending coins
POST /api/crypto/buy - Buy cryptocurrency
POST /api/crypto/sell - Sell cryptocurrency
GET /api/crypto/portfolio/:userId - Get user portfolio
POST /api/crypto/alerts - Set price alerts
GET /api/crypto/history/:coinId - Get historical data
```

### Card Management
```
POST /api/cards/apply - Apply for new card
POST /api/cards/issue - Issue approved card
GET /api/cards/:cardId - Get card details
GET /api/cards/:cardId/transactions - Get card transactions
PATCH /api/cards/:cardId/status - Block/unblock card
PUT /api/cards/:cardId/controls - Set card controls
POST /api/cards/:cardId/add-funds - Add funds (prepaid)
GET /api/cards/:cardId/analytics - Get spending analytics
```

### Web5 Operations
```
POST /api/web5/connect - Connect to Web5
POST /api/web5/profile - Create user profile
GET /api/web5/profile - Get user profile
POST /api/web5/payments - Record payment
GET /api/web5/payments - Get payment history
POST /api/web5/did - Create new DID
GET /api/web5/did - Get current DID
GET /api/web5/health - Web5 service status
```

### Terminal Operations
```
GET /api/terminal/status - Terminal system status
POST /api/terminal/execute - Execute terminal command
POST /api/terminal/vtap/transaction - VTAP transaction
POST /api/terminal/n8n/trigger - Trigger n8n workflow
GET /api/terminal/session - Get terminal session info
```

## 🔄 Workflow Automation

### n8n Integration
The platform includes pre-configured n8n workflows for payment processing:

1. **Payment Processing Workflow**: Automated payment routing and Web5 recording
2. **Webhook Triggers**: Real-time payment notifications
3. **Multi-processor Support**: Handles all payment methods seamlessly

Import the workflow from `workflows/n8n/payment-processing-workflow.json`

## 💻 Development

### Build Commands
```bash
npm run build          # Compile TypeScript
npm run dev            # Start development server
npm run start          # Start production server
npm run test           # Run tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Project Structure
```
src/
├── controllers/       # Request handlers
├── services/         # Business logic
│   ├── web5Service.ts
│   ├── paymentService.ts
│   ├── cryptoService.ts
│   └── cardService.ts
├── routes/           # API routes
├── middleware/       # Express middleware
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── config/          # Configuration files

workflows/
└── n8n/             # n8n workflow definitions

cli/                 # Command-line interface
docs/               # Documentation
```

## 🛡 Security Features

- **Helmet.js**: Security headers and protection
- **CORS**: Cross-origin resource sharing configuration
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schema validation
- **Environment Variables**: Secure configuration management
- **Rate Limiting**: API endpoint protection

## 📊 Monitoring & Analytics

- **Request Logging**: Comprehensive request/response logging
- **Error Handling**: Centralized error management
- **Performance Metrics**: Response time tracking
- **Health Checks**: System status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the `docs/` folder
- Use the CLI help command: `web5-fintech> help`

---

**Built with ❤️ using Web5, modern fintech APIs, and GitHub Copilot**
