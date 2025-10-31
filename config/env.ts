export class Env {
  public static readonly BASE_URL = Env.getEnvVar('UI_BASE_URL');
  public static readonly CARTO_URL = Env.getEnvVar('CARTO_BASE_URL');
  public static readonly USERNAME = Env.getEnvVar('UI_USERNAME');
  public static readonly PASSWORD = Env.getEnvVar('UI_PASSWORD');

  public static readonly API_URL = Env.getEnvVar('API_URL');
  public static readonly API_USER_NAME = Env.getEnvVar('API_USER_NAME');
  public static readonly API_USER_PASSWORD = Env.getEnvVar('API_USER_PASSWORD');
  public static readonly TEST_USER_PASSWORD = Env.getEnvVar('TEST_USER_PASSWORD');

  public static readonly API_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

  public static readonly API_CONFIG = {
    baseUrl: Env.API_URL,
    headers: Env.API_HEADERS,
  };

  private static getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set correctly`);
    }
    return value;
  }
}
