import { ApiHelper } from './apiHelper';
import { UserSession } from './userSession';

export async function buildRequestData(
  scenario: any,
  session: UserSession
): Promise<{
  endpoint: string;
  headers: Record<string, string>;
  body: any;
  username: string;
  password: string;
  userId: string;
}> {
  const helper = new ApiHelper();
  const headers: Record<string, string> = { ...helper.getHeaders() };

  const username = `acct_user_${Date.now()}`;
  const password = scenario.invalidPassword ? '111111' : helper.getPassword();
  const cleanUp = scenario.cleanUp;
  let userId = '';

  if (scenario.requiresNewUser) {
    console.warn(`Creating new user: ${scenario.id}`);
    userId = await session.createUser(username, password, cleanUp);
    headers['Authorization'] = `Bearer ${session.token}`;
  } else if (scenario.requiresUser) {
    console.warn('Using existing user from config');
    await session.generateToken(helper.getUserName(), helper.getPassword());
    headers['Authorization'] = `Bearer ${session.token}`;
  } else if (scenario.requiresToken) {
    console.warn('Generating token (no user creation)');
    await session.generateToken(username, password);
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  if (scenario.useInvalidToken || scenario.auth === 'invalid') {
    headers['Authorization'] = 'Bearer invalid';
  }

  let uuidToUse = userId;
  if (scenario.invalidUuid) {
    uuidToUse = 'invalid-user-id';
    console.warn(`Using invalid UUID for scenario ${scenario.id}`);
  }

  const endpoint = scenario.endpoint.replace('{UUID}', uuidToUse || 'invalid');

  let body = scenario.body;
  if (!body && endpoint.includes('/User') && scenario.method === 'POST') {
    body = { userName: `acct_user_${Date.now()}`, password };
  }
  if (!body && endpoint.includes('/Authorized')) {
    body = { userName: helper.getUserName(), password: helper.getPassword() };
  }

  return { endpoint, headers, body, username, password, userId };
}
