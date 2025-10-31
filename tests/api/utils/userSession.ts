import { request, APIRequestContext, expect } from '@playwright/test';
import { Env } from '../../../config/env';

export class UserSession {
  private api!: APIRequestContext;
  userId: string | null = null;
  token: string | null = null;
  cleanUp: boolean | null = true;

  async init(): Promise<void> {
    this.api = await request.newContext({
      baseURL: Env.API_URL,
      extraHTTPHeaders: Env.API_HEADERS,
    });
  }

  async createUser(userName: string, password: string, cleanUp: boolean): Promise<string> {
    this.cleanUp = cleanUp;
    const response = await this.api.post('/Account/v1/User', {
      data: { userName, password },
    });

    if (response.status() === 201) {
      const body = await response.json();
      this.userId = body.userID || body.userId;
      await this.generateToken(userName, password);
      return this.userId!;
    }

    throw new Error(`Unexpected error in createUser(): ${response.status()}`);
  }

  async generateToken(userName: string, password: string): Promise<string> {
    const response = await this.api.post('/Account/v1/GenerateToken', {
      data: { userName, password },
    });

    const body = await response.json().catch(() => {
      throw new Error('Error parsing token response');
    });

    expect(response.status()).toBe(200);
    this.token = body.token;
    console.log('Token generated.');
    return this.token!;
  }

  async deleteUser(): Promise<void> {
    console.warn("ENTRO DELETE??");
    console.warn(`this user ID: ${this.userId}`);
    console.warn(`this token: ${this.token}`);
    console.warn(`this CLEAN UP: ${this.cleanUp}`);
    if (!this.cleanUp) {
      console.warn('No Cleaning data')
      return;
    }
    if (!this.userId || !this.token) {
      console.log('No user or token to delete.');
      return;
    }

    await this.api.delete(`/Account/v1/User/${this.userId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    console.log(`User ${this.userId} deleted.`);
  }

  async dispose(): Promise<void> {
    await this.api.dispose();
  }
}
