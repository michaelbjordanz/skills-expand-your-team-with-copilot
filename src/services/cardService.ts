export interface CardApplication {
  userId: string;
  cardType: 'debit' | 'credit' | 'prepaid';
  network: 'mastercard' | 'visa';
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  creditInfo?: {
    annualIncome: number;
    employmentStatus: string;
    creditScore?: number;
  };
}

export interface IssuedCard {
  cardId: string;
  userId: string;
  cardNumber: string; // Masked for security
  cardType: 'debit' | 'credit' | 'prepaid';
  network: 'mastercard' | 'visa';
  expiryDate: string;
  cvv: string; // In real implementation, this would be encrypted
  status: 'active' | 'blocked' | 'expired' | 'cancelled';
  creditLimit?: number;
  availableBalance: number;
  issuedDate: string;
  activationDate?: string;
  holderName: string;
  cardDesign?: string;
}

export interface CardTransaction {
  transactionId: string;
  cardId: string;
  merchantName: string;
  amount: number;
  currency: string;
  transactionType: 'purchase' | 'withdrawal' | 'refund' | 'fee';
  category: string;
  status: 'pending' | 'completed' | 'declined';
  timestamp: string;
  location?: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  merchantCategory: string;
}

export interface CardControls {
  cardId: string;
  isEnabled: boolean;
  spendingLimits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  allowedMerchantCategories: string[];
  blockedMerchantCategories: string[];
  internationalTransactions: boolean;
  onlineTransactions: boolean;
  atmWithdrawals: boolean;
  contactlessPayments: boolean;
}

export class CardService {
  
  // Process card application
  async applyForCard(application: CardApplication): Promise<{ success: boolean; applicationId: string; message: string }> {
    try {
      console.log(`💳 Processing ${application.cardType} card application for ${application.applicantInfo.email}...`);
      
      // Simulate application processing
      await this.simulateProcessingDelay();
      
      // Basic validation
      const validationResult = this.validateApplication(application);
      if (!validationResult.isValid) {
        return {
          success: false,
          applicationId: '',
          message: validationResult.message
        };
      }

      const applicationId = this.generateApplicationId();
      
      console.log(`✅ Card application submitted successfully: ${applicationId}`);
      return {
        success: true,
        applicationId,
        message: `${application.cardType} card application received. Processing time: 5-7 business days.`
      };
    } catch (error) {
      console.error('❌ Card application failed:', error);
      throw error;
    }
  }

  // Issue a new card (after approval)
  async issueCard(applicationId: string, cardType: 'debit' | 'credit' | 'prepaid', network: 'mastercard' | 'visa'): Promise<IssuedCard> {
    try {
      console.log(`🏦 Issuing ${cardType} ${network} card for application ${applicationId}...`);
      
      // Simulate card production
      await this.simulateProcessingDelay(2000);
      
      const card: IssuedCard = {
        cardId: this.generateCardId(),
        userId: 'user_' + applicationId.split('_')[1],
        cardNumber: this.generateMaskedCardNumber(network),
        cardType,
        network,
        expiryDate: this.generateExpiryDate(),
        cvv: this.generateCVV(),
        status: 'active',
        creditLimit: cardType === 'credit' ? 5000 : undefined,
        availableBalance: cardType === 'prepaid' ? 0 : (cardType === 'credit' ? 5000 : 1000),
        issuedDate: new Date().toISOString(),
        holderName: 'JOHN DOE', // In reality, from application
        cardDesign: 'default'
      };

      console.log(`✅ Card issued successfully: ${card.cardNumber}`);
      return card;
    } catch (error) {
      console.error('❌ Card issuance failed:', error);
      throw error;
    }
  }

  // Get card details
  async getCard(cardId: string): Promise<IssuedCard | null> {
    try {
      console.log(`🔍 Retrieving card details for ${cardId}...`);
      
      // Simulate database lookup
      await this.simulateProcessingDelay(300);
      
      // Mock card data
      const mockCard: IssuedCard = {
        cardId,
        userId: 'user_123',
        cardNumber: '**** **** **** 1234',
        cardType: 'debit',
        network: 'mastercard',
        expiryDate: '12/27',
        cvv: '***',
        status: 'active',
        availableBalance: 2450.75,
        issuedDate: '2024-01-15T00:00:00Z',
        activationDate: '2024-01-20T00:00:00Z',
        holderName: 'JOHN DOE'
      };

      return mockCard;
    } catch (error) {
      console.error('❌ Failed to retrieve card:', error);
      return null;
    }
  }

  // Get card transaction history
  async getCardTransactions(cardId: string, limit: number = 50): Promise<CardTransaction[]> {
    try {
      console.log(`📊 Fetching transaction history for card ${cardId}...`);
      
      // Mock transaction data
      const mockTransactions: CardTransaction[] = [
        {
          transactionId: 'txn_' + Date.now(),
          cardId,
          merchantName: 'Amazon.com',
          amount: 89.99,
          currency: 'USD',
          transactionType: 'purchase',
          category: 'Online Shopping',
          status: 'completed',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          location: { city: 'Seattle', country: 'US' },
          merchantCategory: 'E-commerce'
        },
        {
          transactionId: 'txn_' + (Date.now() - 1000),
          cardId,
          merchantName: 'Starbucks',
          amount: 5.75,
          currency: 'USD',
          transactionType: 'purchase',
          category: 'Coffee & Cafes',
          status: 'completed',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          location: { city: 'New York', country: 'US' },
          merchantCategory: 'Food & Beverage'
        }
      ];

      return mockTransactions.slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error);
      throw error;
    }
  }

  // Block/Unblock card
  async toggleCardStatus(cardId: string, action: 'block' | 'unblock'): Promise<boolean> {
    try {
      console.log(`🔒 ${action === 'block' ? 'Blocking' : 'Unblocking'} card ${cardId}...`);
      
      await this.simulateProcessingDelay(500);
      
      console.log(`✅ Card ${action}ed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to ${action} card:`, error);
      return false;
    }
  }

  // Set card controls and limits
  async setCardControls(cardId: string, controls: Partial<CardControls>): Promise<boolean> {
    try {
      console.log(`⚙️ Updating card controls for ${cardId}...`);
      
      await this.simulateProcessingDelay(300);
      
      console.log('✅ Card controls updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update card controls:', error);
      return false;
    }
  }

  // Add funds to prepaid card
  async addFunds(cardId: string, amount: number): Promise<boolean> {
    try {
      console.log(`💰 Adding $${amount} to prepaid card ${cardId}...`);
      
      await this.simulateProcessingDelay(1000);
      
      console.log(`✅ $${amount} added successfully`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add funds:', error);
      return false;
    }
  }

  // Get card spending analytics
  async getSpendingAnalytics(cardId: string, period: 'month' | 'quarter' | 'year'): Promise<any> {
    try {
      console.log(`📈 Generating spending analytics for ${period}...`);
      
      await this.simulateProcessingDelay(800);
      
      const analytics = {
        period,
        totalSpent: 1250.47,
        transactionCount: 23,
        averageTransaction: 54.37,
        categoryBreakdown: {
          'Food & Dining': 320.15,
          'Shopping': 280.45,
          'Transportation': 180.20,
          'Entertainment': 150.80,
          'Bills & Utilities': 125.40,
          'Other': 193.47
        },
        monthlyComparison: {
          currentMonth: 1250.47,
          previousMonth: 980.32,
          changePercent: 27.5
        }
      };

      return analytics;
    } catch (error) {
      console.error('❌ Failed to generate analytics:', error);
      throw error;
    }
  }

  // Private utility methods
  private validateApplication(application: CardApplication): { isValid: boolean; message: string } {
    // Basic validation logic
    if (!application.applicantInfo.email.includes('@')) {
      return { isValid: false, message: 'Invalid email address' };
    }
    
    if (application.cardType === 'credit' && !application.creditInfo) {
      return { isValid: false, message: 'Credit information required for credit card application' };
    }

    return { isValid: true, message: 'Application valid' };
  }

  private async simulateProcessingDelay(ms: number = 1000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateApplicationId(): string {
    return 'app_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateCardId(): string {
    return 'card_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateMaskedCardNumber(network: 'mastercard' | 'visa'): string {
    const prefix = network === 'mastercard' ? '5*** **** ****' : '4*** **** ****';
    const suffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefix} ${suffix}`;
  }

  private generateExpiryDate(): string {
    const now = new Date();
    const expiryYear = now.getFullYear() + 4;
    const expiryMonth = Math.floor(Math.random() * 12) + 1;
    return `${expiryMonth.toString().padStart(2, '0')}/${expiryYear.toString().substr(2)}`;
  }

  private generateCVV(): string {
    return Math.floor(Math.random() * 900 + 100).toString();
  }
}