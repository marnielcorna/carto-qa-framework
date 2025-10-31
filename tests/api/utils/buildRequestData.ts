import { Env } from '../../../config/env';
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
    const apiConfig = Env.API_CONFIG;
    const headers: Record<string, string> = { ...apiConfig.headers };

    const username = `acct_user_${Date.now()}`;
    const password = scenario.invalidPassword ? '111111' : apiConfig.userPassword;
    const cleanUp = scenario.cleanUp;
    let userId = '';

    if (scenario.requiresNewUser) {
        console.warn(`Creating new user for scenario ${scenario.id}`);
        userId = await session.createUser(username, password, cleanUp);
        headers['Authorization'] = `Bearer ${session.token}`;
    } else if (scenario.requiresUser) {
        console.warn('Using existing user from .env');
        await session.generateToken(apiConfig.userName, apiConfig.userPassword);
        headers['Authorization'] = `Bearer ${session.token}`;
    } else if (scenario.requiresToken) {
        console.warn('Generating token only (no user creation)');
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
        body = { userName: apiConfig.userName, password: apiConfig.userPassword };
    }

    return { endpoint, headers, body, username, password, userId };
}
