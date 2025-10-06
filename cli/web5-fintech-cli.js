#!/usr/bin/env node

const axios = require('axios');
const readline = require('readline');

// CLI Configuration
const API_BASE_URL = process.env.WEB5_FINTECH_API || 'http://localhost:3000/api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Web5FintechCLI {
  constructor() {
    this.apiUrl = API_BASE_URL;
    this.user = null;
  }

  async start() {
    console.log('\n🚀 Welcome to Web5 Fintech CLI');
    console.log('=====================================');
    console.log('Available commands:');
    console.log('- balance: Check account balances');
    console.log('- pay <amount> <currency> <method>: Process payment');
    console.log('- crypto <action> <symbol> [amount]: Crypto operations (buy/sell/price)');
    console.log('- card <action> [cardId]: Card operations (list/block/unblock)');
    console.log('- web5 <action>: Web5 operations (connect/profile/did)');
    console.log('- help: Show this help message');
    console.log('- exit: Exit the CLI\n');

    this.promptUser();
  }

  promptUser() {
    rl.question('web5-fintech> ', async (input) => {
      const args = input.trim().split(' ');
      const command = args[0].toLowerCase();

      try {
        switch (command) {
          case 'balance':
            await this.checkBalance();
            break;
          case 'pay':
            await this.processPayment(args.slice(1));
            break;
          case 'crypto':
            await this.cryptoOperations(args.slice(1));
            break;
          case 'card':
            await this.cardOperations(args.slice(1));
            break;
          case 'web5':
            await this.web5Operations(args.slice(1));
            break;
          case 'help':
            await this.showHelp();
            break;
          case 'exit':
            console.log('👋 Goodbye!');
            rl.close();
            return;
          case '':
            break;
          default:
            console.log(`❌ Unknown command: ${command}. Type 'help' for available commands.`);
        }
      } catch (error) {
        console.error('❌ Error:', error.message);
      }

      this.promptUser();
    });
  }

  async checkBalance() {
    try {
      console.log('💰 Checking balances...');
      
      // Simulate balance check
      const balances = {
        checking: { amount: 2450.75, currency: 'USD' },
        savings: { amount: 8750.25, currency: 'USD' },
        crypto: [
          { symbol: 'BTC', amount: 0.5, value: 21500.00 },
          { symbol: 'ETH', amount: 2.5, value: 8250.00 }
        ],
        cards: [
          { type: 'debit', available: 2450.75, currency: 'USD' },
          { type: 'credit', available: 4750.00, limit: 5000.00, currency: 'USD' }
        ]
      };

      console.log('\n📊 Account Balances:');
      console.log(`   Checking: $${balances.checking.amount}`);
      console.log(`   Savings:  $${balances.savings.amount}`);
      console.log('\n₿ Crypto Holdings:');
      balances.crypto.forEach(crypto => {
        console.log(`   ${crypto.symbol}: ${crypto.amount} ($${crypto.value})`);
      });
      console.log('\n💳 Card Balances:');
      balances.cards.forEach(card => {
        const limit = card.limit ? ` / $${card.limit}` : '';
        console.log(`   ${card.type}: $${card.available}${limit}`);
      });
      
      const totalValue = balances.checking.amount + balances.savings.amount + 
                        balances.crypto.reduce((sum, c) => sum + c.value, 0);
      console.log(`\n💎 Total Portfolio Value: $${totalValue.toFixed(2)}`);
      
    } catch (error) {
      console.error('❌ Failed to check balance:', error.message);
    }
  }

  async processPayment(args) {
    if (args.length < 3) {
      console.log('❌ Usage: pay <amount> <currency> <method>');
      console.log('   Methods: mastercard, paypal, braintree, plaid');
      return;
    }

    const [amount, currency, method] = args;
    
    try {
      console.log(`💳 Processing ${method} payment: ${amount} ${currency}...`);
      
      const response = await axios.post(`${this.apiUrl}/payments/process`, {
        amount: parseFloat(amount),
        currency: currency.toUpperCase(),
        paymentMethod: method,
        customerInfo: {
          name: 'CLI User',
          email: 'cli@example.com'
        }
      });

      if (response.data.success) {
        console.log('✅ Payment processed successfully!');
        console.log(`   Transaction ID: ${response.data.transactionId}`);
        console.log(`   Status: ${response.data.status}`);
        console.log(`   Processing Time: ${response.data.processingTime}`);
        if (response.data.fees) {
          console.log(`   Fees: $${response.data.fees.toFixed(2)}`);
        }
      } else {
        console.log('❌ Payment failed:', response.data.message);
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error.response?.data?.message || error.message);
    }
  }

  async cryptoOperations(args) {
    if (args.length < 2) {
      console.log('❌ Usage: crypto <action> <symbol> [amount]');
      console.log('   Actions: buy, sell, price, portfolio');
      return;
    }

    const [action, symbol, amount] = args;

    try {
      switch (action.toLowerCase()) {
        case 'price':
          console.log(`📈 Getting price for ${symbol.toUpperCase()}...`);
          const priceResponse = await axios.get(`${this.apiUrl}/crypto/price/${symbol.toLowerCase()}`);
          const coin = priceResponse.data.data;
          
          console.log(`\n💰 ${coin.name} (${coin.symbol.toUpperCase()})`);
          console.log(`   Price: $${coin.current_price.toLocaleString()}`);
          console.log(`   24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%`);
          console.log(`   Market Cap: $${coin.market_cap.toLocaleString()}`);
          console.log(`   Rank: #${coin.market_cap_rank}`);
          break;

        case 'buy':
          if (!amount) {
            console.log('❌ Amount required for buy operation');
            return;
          }
          console.log(`💳 Buying $${amount} of ${symbol.toUpperCase()}...`);
          const buyResponse = await axios.post(`${this.apiUrl}/crypto/buy`, {
            userId: 'cli_user',
            symbol: symbol.toLowerCase(),
            amountUSD: parseFloat(amount)
          });
          
          if (buyResponse.data.success) {
            const order = buyResponse.data.order;
            console.log('✅ Buy order executed!');
            console.log(`   Amount: ${order.amount.toFixed(8)} ${order.symbol}`);
            console.log(`   Price: $${order.price.toLocaleString()}`);
            console.log(`   Total: $${order.total.toFixed(2)}`);
          }
          break;

        case 'sell':
          if (!amount) {
            console.log('❌ Amount required for sell operation');
            return;
          }
          console.log(`💸 Selling ${amount} ${symbol.toUpperCase()}...`);
          const sellResponse = await axios.post(`${this.apiUrl}/crypto/sell`, {
            userId: 'cli_user',
            symbol: symbol.toLowerCase(),
            cryptoAmount: parseFloat(amount)
          });
          
          if (sellResponse.data.success) {
            const order = sellResponse.data.order;
            console.log('✅ Sell order executed!');
            console.log(`   Amount: ${order.amount} ${order.symbol}`);
            console.log(`   Price: $${order.price.toLocaleString()}`);
            console.log(`   Total: $${order.total.toFixed(2)}`);
          }
          break;

        case 'portfolio':
          console.log('📊 Fetching crypto portfolio...');
          const portfolioResponse = await axios.get(`${this.apiUrl}/crypto/portfolio/cli_user`);
          
          if (portfolioResponse.data.success) {
            const portfolio = portfolioResponse.data.portfolio;
            console.log('\n₿ Crypto Portfolio:');
            console.log(`   Total Value: $${portfolio.totalValue.toFixed(2)}`);
            console.log(`   Total P&L: ${portfolio.totalPnL >= 0 ? '+' : ''}$${portfolio.totalPnL.toFixed(2)}`);
            console.log('\n   Holdings:');
            
            portfolio.holdings.forEach(holding => {
              const pnlColor = holding.pnl >= 0 ? '🟢' : '🔴';
              console.log(`   ${pnlColor} ${holding.symbol}: ${holding.amount} ($${holding.currentValue.toFixed(2)})`);
              console.log(`      P&L: ${holding.pnl >= 0 ? '+' : ''}$${holding.pnl.toFixed(2)} (${holding.pnlPercentage.toFixed(2)}%)`);
            });
          }
          break;

        default:
          console.log('❌ Unknown crypto action. Available: buy, sell, price, portfolio');
      }
    } catch (error) {
      console.error('❌ Crypto operation error:', error.response?.data?.message || error.message);
    }
  }

  async cardOperations(args) {
    const [action, cardId] = args;

    try {
      switch (action?.toLowerCase()) {
        case 'list':
          console.log('💳 Your Cards:');
          console.log('   📇 card_001 - Debit Card (**** 1234) - Active');
          console.log('   💳 card_002 - Credit Card (**** 5678) - Active');
          console.log('   🎁 card_003 - Prepaid Card (**** 9012) - Active');
          break;

        case 'block':
          if (!cardId) {
            console.log('❌ Card ID required for block operation');
            return;
          }
          console.log(`🔒 Blocking card ${cardId}...`);
          const blockResponse = await axios.patch(`${this.apiUrl}/cards/${cardId}/status`, {
            action: 'block'
          });
          
          if (blockResponse.data.success) {
            console.log('✅ Card blocked successfully');
          }
          break;

        case 'unblock':
          if (!cardId) {
            console.log('❌ Card ID required for unblock operation');
            return;
          }
          console.log(`🔓 Unblocking card ${cardId}...`);
          const unblockResponse = await axios.patch(`${this.apiUrl}/cards/${cardId}/status`, {
            action: 'unblock'
          });
          
          if (unblockResponse.data.success) {
            console.log('✅ Card unblocked successfully');
          }
          break;

        case 'transactions':
          if (!cardId) {
            console.log('❌ Card ID required for transactions');
            return;
          }
          console.log(`📊 Recent transactions for ${cardId}:`);
          const txResponse = await axios.get(`${this.apiUrl}/cards/${cardId}/transactions`);
          
          if (txResponse.data.success) {
            txResponse.data.transactions.slice(0, 5).forEach(tx => {
              const date = new Date(tx.timestamp).toLocaleDateString();
              console.log(`   ${date} - ${tx.merchantName}: $${tx.amount} (${tx.status})`);
            });
          }
          break;

        default:
          console.log('❌ Usage: card <action> [cardId]');
          console.log('   Actions: list, block, unblock, transactions');
      }
    } catch (error) {
      console.error('❌ Card operation error:', error.response?.data?.message || error.message);
    }
  }

  async web5Operations(args) {
    const [action] = args;

    try {
      switch (action?.toLowerCase()) {
        case 'connect':
          console.log('🔗 Connecting to Web5...');
          const connectResponse = await axios.post(`${this.apiUrl}/web5/connect`);
          
          if (connectResponse.data.success) {
            console.log('✅ Web5 connected successfully!');
            console.log(`   DID: ${connectResponse.data.did}`);
          }
          break;

        case 'did':
          console.log('🆔 Getting current DID...');
          const didResponse = await axios.get(`${this.apiUrl}/web5/did`);
          
          if (didResponse.data.success) {
            console.log(`   DID: ${didResponse.data.did}`);
          }
          break;

        case 'profile':
          console.log('👤 Getting user profile...');
          const profileResponse = await axios.get(`${this.apiUrl}/web5/profile`);
          
          if (profileResponse.data.success) {
            const profile = profileResponse.data.profile;
            console.log(`   Name: ${profile.name}`);
            console.log(`   Email: ${profile.email}`);
            console.log(`   DID: ${profile.did}`);
            console.log(`   KYC Status: ${profile.kycStatus}`);
          } else {
            console.log('❌ No profile found. Create one first.');
          }
          break;

        case 'payments':
          console.log('💸 Getting Web5 payment history...');
          const paymentsResponse = await axios.get(`${this.apiUrl}/web5/payments`);
          
          if (paymentsResponse.data.success) {
            console.log(`   Found ${paymentsResponse.data.count} payments:`);
            paymentsResponse.data.payments.slice(0, 5).forEach(payment => {
              const date = new Date(payment.timestamp).toLocaleDateString();
              console.log(`   ${date} - ${payment.amount} ${payment.currency} (${payment.status})`);
            });
          }
          break;

        default:
          console.log('❌ Usage: web5 <action>');
          console.log('   Actions: connect, did, profile, payments');
      }
    } catch (error) {
      console.error('❌ Web5 operation error:', error.response?.data?.message || error.message);
    }
  }

  async showHelp() {
    console.log('\n🚀 Web5 Fintech CLI - Command Reference');
    console.log('==========================================');
    console.log('💰 balance                              - Check all account balances');
    console.log('💳 pay <amount> <currency> <method>     - Process payment');
    console.log('₿  crypto price <symbol>               - Get crypto price');
    console.log('₿  crypto buy <symbol> <usd_amount>    - Buy cryptocurrency');
    console.log('₿  crypto sell <symbol> <crypto_amount> - Sell cryptocurrency');
    console.log('₿  crypto portfolio                    - View crypto portfolio');
    console.log('🎴 card list                           - List all cards');
    console.log('🎴 card block <cardId>                 - Block a card');
    console.log('🎴 card unblock <cardId>               - Unblock a card');
    console.log('🎴 card transactions <cardId>          - View card transactions');
    console.log('🌐 web5 connect                        - Connect to Web5');
    console.log('🌐 web5 did                            - Get current DID');
    console.log('🌐 web5 profile                        - View user profile');
    console.log('🌐 web5 payments                       - View Web5 payments');
    console.log('❓ help                                - Show this help');
    console.log('👋 exit                                - Exit CLI\n');
  }
}

// Start the CLI
if (require.main === module) {
  const cli = new Web5FintechCLI();
  cli.start().catch(console.error);
}

module.exports = Web5FintechCLI;