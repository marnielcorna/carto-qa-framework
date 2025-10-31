import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Env } from '../../../config/env';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

export class ApiHelper {
  private testData: any;

  constructor() {
    const file = path.resolve(__dirname, '../data/api-testdata.json');
    this.testData = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  getScenarios() {
    return this.testData.scenarios;
  }

  getScenario(id: string) {
    return this.getScenarios().find((s: { id: string }) => s.id === id);
  }

  getBaseUrl(): string {
    return Env.API_URL;
  }

  getHeaders(): Record<string, string> {
    return Env.API_HEADERS;
  }

  getUserName(): string {
    return Env.API_USER_NAME;
  }

  getPassword(): string {
    return Env.API_USER_PASSWORD;
  }

  getTestPassword(): string {
    return Env.TEST_USER_PASSWORD;
  }
}
