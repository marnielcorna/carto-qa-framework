import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

export class Env {
  static get API_CONFIG() {
    return {
      baseUrl: Env.safeGet('API_URL'),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      userName: Env.safeGet('API_USER_NAME'),
      userPassword: Env.safeGet('API_USER_PASSWORD'),
      testPassword: Env.safeGet('TEST_USER_PASSWORD'),
    };
  }

  static get UI_CONFIG() {
    return {
      baseUrl: Env.safeGet('UI_BASE_URL', false),
      cartoUrl: Env.safeGet('CARTO_BASE_URL', false),
      username: Env.safeGet('UI_USERNAME', false),
      password: Env.safeGet('UI_PASSWORD', false),
    };
  }

  private static safeGet(key: string, required = true): string {
    const value = process.env[key];
    if (!value) {
      if (required) {
        throw new Error(`Environment variable ${key} is not set correctly`);
      } else {
        console.warn(`Optional environment variable ${key} not found`);
        return '';
      }
    }
    return value;
  }
}
