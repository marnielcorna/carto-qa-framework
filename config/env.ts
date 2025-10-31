import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️ No .env file found. Using system environment variables.');
}

export class Env {
  public static readonly API_URL = Env.get('API_URL');
  public static readonly API_USER_NAME = Env.get('API_USER_NAME');
  public static readonly API_USER_PASSWORD = Env.get('API_USER_PASSWORD');
  public static readonly TEST_USER_PASSWORD = Env.get('TEST_USER_PASSWORD');

  public static readonly UI_BASE_URL = Env.get('UI_BASE_URL');
  public static readonly CARTO_BASE_URL = Env.get('CARTO_BASE_URL');
  public static readonly UI_USERNAME = Env.get('UI_USERNAME');
  public static readonly UI_PASSWORD = Env.get('UI_PASSWORD');

  public static readonly API_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private static get(key: string): string {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      console.warn(`Environment variable "${key}" is not found`);
      return '';
    }
    return value;
  }
}
