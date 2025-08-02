import { Injectable, Logger } from '@nestjs/common';
import { JITO_CONFIG } from './constants/jito.constants';
import { JitoResponse } from './interfaces/jito-response.interface';
import fetch from 'node-fetch';

@Injectable()
export class JitoService {
  private readonly logger = new Logger(JitoService.name);
  private readonly endpoint = JITO_CONFIG.endpoint;
  private readonly tipAccount = JITO_CONFIG.tipAccount;

  constructor() {
    this.logger.log('JitoService initialized', {
      endpoint: this.endpoint,
      tipAccount: this.tipAccount,
    });
  }

  async sendBundle(transactions: string[]): Promise<JitoResponse> {
    try {
      this.logger.log('Sending bundle to Jito', {
        transactionCount: transactions.length,
      });

      const response = await fetch(`${this.endpoint}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'sendBundle',
          params: [transactions],
        }),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.logger.error('Jito bundle send error', error);
      throw error;
    }
  }

  async getBundleStatus(bundleId: string): Promise<JitoResponse> {
    try {
      this.logger.log('Getting bundle status from Jito', { bundleId });

      const response = await fetch(`${this.endpoint}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getBundleStatuses',
          params: [[bundleId]],
        }),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.logger.error('Jito bundle status error', error);
      throw error;
    }
  }

  async getTipAccounts(): Promise<JitoResponse> {
    try {
      this.logger.log('Getting tip accounts from Jito');

      const response = await fetch(`${this.endpoint}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getTipAccounts',
          params: [],
        }),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.logger.error('Jito tip accounts error', error);
      throw error;
    }
  }

  async proxyRequest(method: string, params: any[] = []): Promise<JitoResponse> {
    try {
      this.logger.log('Proxying Jito request', { method, params });

      const response = await fetch(`${this.endpoint}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        }),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.logger.error('Jito proxy request error', error);
      throw error;
    }
  }

  getServiceInfo() {
    return {
      endpoint: this.endpoint,
      tipAccount: this.tipAccount,
      availableMethods: [
        'sendBundle',
        'getBundleStatuses',
        'getTipAccounts',
      ],
    };
  }

  private async handleResponse(response: any): Promise<JitoResponse> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jito request failed: ${response.status} - ${errorText}`);
    }
    return response.json();
  }
}