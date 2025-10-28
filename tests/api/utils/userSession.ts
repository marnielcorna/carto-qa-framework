import { request, APIRequestContext, expect } from '@playwright/test';
import { ApiHelper } from './apiHelper';

export class UserSession {
  private api!: APIRequestContext;
  private helper: ApiHelper;
  userId: string | null = null;
  token: string | null = null;

  constructor(helper: ApiHelper) {
    this.helper = helper;
  }

  async init(): Promise<void> {
    const env = this.helper.getEnv();
    this.api = await request.newContext({
      baseURL: env.baseUrl,
      extraHTTPHeaders: env.headers
    });
  }

  async createUser(userName: string, password: string): Promise<string> {
    const response = await this.api.post('/Account/v1/User', {
      data: { userName, password }
    });
    const body = await response.json();
    expect(response.status()).toBe(201);
    this.userId = body.userID || body.userId;

    // genera token automáticamente
    await this.generateToken(userName, password);

    return this.userId!;
  }

  async generateToken(userName: string, password: string): Promise<string> {
    const response = await this.api.post('/Account/v1/GenerateToken', {
      data: { userName, password }
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    this.token = body.token;
    console.log(`Token generated: ${this.token?.slice(0, 15)}...`);
    return this.token!;
  }

  async deleteUser(): Promise<void> {
    if (!this.userId || !this.token) {
      console.log('No user or token to delete.');
      return;
    }
    const response = await this.api.delete(`/Account/v1/User/${this.userId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    console.log(`User ${this.userId} deleted → status ${response.status()}`);
  }

  async dispose(): Promise<void> {
    await this.api.dispose();
  }
}
