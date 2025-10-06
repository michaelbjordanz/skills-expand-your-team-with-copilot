import { Web5, DidApi, Record } from '@web5/api';
import { DidDht, DidIon, DidJwk, DidKey } from '@web5/dids';

export interface UserProfile {
  name: string;
  email: string;
  did: string;
  walletAddress?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  transactionHash?: string;
}

export class Web5Service {
  private web5: Web5 | null = null;
  private userDid: string | null = null;

  async initialize(): Promise<{ web5: Web5; did: string }> {
    try {
      const result = await Web5.connect();
      this.web5 = result.web5;
      this.userDid = result.did;
      
      console.log('✅ Web5 service initialized');
      console.log(`🆔 User DID: ${this.userDid}`);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to initialize Web5:', error);
      throw error;
    }
  }

  async createUserProfile(profileData: Omit<UserProfile, 'did' | 'createdAt'>): Promise<UserProfile> {
    if (!this.web5 || !this.userDid) {
      throw new Error('Web5 not initialized');
    }

    const profile: UserProfile = {
      ...profileData,
      did: this.userDid,
      createdAt: new Date().toISOString()
    };

    try {
      const { record } = await this.web5.dwn.records.create({
        data: profile,
        message: {
          schema: 'https://schema.org/Person',
          dataFormat: 'application/json'
        }
      });

      console.log('✅ User profile created:', profile.did);
      return profile;
    } catch (error) {
      console.error('❌ Failed to create user profile:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.web5) {
      throw new Error('Web5 not initialized');
    }

    try {
      const { records } = await this.web5.dwn.records.query({
        message: {
          filter: {
            schema: 'https://schema.org/Person'
          }
        }
      });

      if (records && records.length > 0) {
        const profileData = await records[0].data.json();
        return profileData as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw error;
    }
  }

  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'timestamp'>): Promise<PaymentRecord> {
    if (!this.web5) {
      throw new Error('Web5 not initialized');
    }

    const paymentRecord: PaymentRecord = {
      ...payment,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };

    try {
      const { record } = await this.web5.dwn.records.create({
        data: paymentRecord,
        message: {
          schema: 'https://schema.org/PaymentService',
          dataFormat: 'application/json'
        }
      });

      console.log('✅ Payment recorded:', paymentRecord.id);
      return paymentRecord;
    } catch (error) {
      console.error('❌ Failed to record payment:', error);
      throw error;
    }
  }

  async getPaymentHistory(): Promise<PaymentRecord[]> {
    if (!this.web5) {
      throw new Error('Web5 not initialized');
    }

    try {
      const { records } = await this.web5.dwn.records.query({
        message: {
          filter: {
            schema: 'https://schema.org/PaymentService'
          }
        }
      });

      if (!records) return [];

      const payments: PaymentRecord[] = [];
      for (const record of records) {
        const paymentData = await record.data.json();
        payments.push(paymentData as PaymentRecord);
      }

      return payments.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('❌ Failed to get payment history:', error);
      throw error;
    }
  }

  async createDID(method: 'ion' | 'dht' | 'jwk' | 'key' = 'ion'): Promise<string> {
    try {
      let did: string;
      
      switch (method) {
        case 'ion':
          const ionDid = await DidIon.create();
          did = ionDid.uri;
          break;
        case 'dht':
          const dhtDid = await DidDht.create();
          did = dhtDid.uri;
          break;
        case 'jwk':
          const jwkDid = await DidJwk.create();
          did = jwkDid.uri;
          break;
        case 'key':
          const keyDid = await DidKey.create();
          did = keyDid.uri;
          break;
        default:
          throw new Error(`Unsupported DID method: ${method}`);
      }

      console.log(`✅ Created ${method.toUpperCase()} DID:`, did);
      return did;
    } catch (error) {
      console.error(`❌ Failed to create ${method} DID:`, error);
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  getDid(): string | null {
    return this.userDid;
  }

  getWeb5Instance(): Web5 | null {
    return this.web5;
  }
}