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
    const headers: Record<string, string> = { ...Env.API_HEADERS };
    const username = `acct_user_${Date.now()}`;
    const password = scenario.invalidPassword ? '111111' : Env.API_USER_PASSWORD;
    const cleanUp = scenario.cleanUp;
    let userId = '';

    console.warn(`THIS HEADER:: ${headers}`);
    console.warn(`THIS USERNAME:: ${username}`);
    console.warn(`THIS PASSWORD:: ${password}`);
    console.warn(`THIS REQUIRE USER?:: ${scenario.requiresUser}`);
    console.warn(`THIS REQUIRE NEW USER?:: ${scenario.requiresNewUser}`);
    console.warn(`================== REQUIRE USER?:: ${scenario.requiresUser}`);

    if (scenario.requiresNewUser) {
        // Create a brand new temporary user
        console.warn(`🔹 Creating new user for scenario ${scenario.id}`);
        userId = await session.createUser(username, password, cleanUp);
        console.warn(`THIS USER ID IN NEW USER FLOW:: ${userId}`);
        headers['Authorization'] = `Bearer ${session.token}`;
    } else if (scenario.requiresUser) {
        // Use existing user (from .env)
        console.warn(`🔹 Using existing user from .env`);
        await session.generateToken(Env.API_USER_NAME, Env.API_USER_PASSWORD);
        headers['Authorization'] = `Bearer ${session.token}`;
    } else if (scenario.requiresToken) {
        // Only generate token without user creation
        console.warn(`🔹 Generating token only (no user creation)`);
        await session.generateToken(username, password);
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    // Force invalid token if requested
    console.warn(`THIS SCENARIO AUTH:: ${scenario.auth}`);
    if (scenario.useInvalidToken) {
        headers['Authorization'] = 'Bearer invalid';
    } else if (scenario.auth === 'invalid') {
        headers['Authorization'] = 'Bearer invalid';
    }

    // Build endpoint (handle invalid UUID)
    let uuidToUse = userId;

    if (scenario.invalidUuid) {
        uuidToUse = 'invalid-user-id';
        console.warn(`Using invalid UUID for scenario ${scenario.id}`);
    }

    const endpoint = scenario.endpoint.replace('{UUID}', uuidToUse || 'invalid');
    console.warn(`============== FINAL ENDPOINT:: ${endpoint}`);

    // Build request body
    let body = scenario.body;

    if (!body && endpoint.includes('/User') && scenario.method === 'POST') {
        body = { userName: `acct_user_${Date.now()}`, password };
    }

    if (!body && endpoint.includes('/Authorized')) {
        body = { userName: Env.API_USER_NAME, password: Env.API_USER_PASSWORD };
    }

    console.warn(`THIS ENDPOINT:: ${endpoint}`);
    console.warn(`THIS BODY:: ${JSON.stringify(body, null, 2)}`);

    if (body && typeof body === 'object') {
        const replacePlaceholders = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    const original = obj[key];
                    obj[key] = obj[key]
                        .replace('{UUID}', userId || 'invalid-user-id')
                        .replace('{ISBN}', '9781449331818');

                    if (obj[key] !== original) {
                        console.warn(`Replaced placeholder: ${original} → ${obj[key]}`);
                    }
                } else if (typeof obj[key] === 'object') {
                    replacePlaceholders(obj[key]);
                }
            }
        };
        replacePlaceholders(body);
    }


    return { endpoint, headers, body, username, password, userId };
}
