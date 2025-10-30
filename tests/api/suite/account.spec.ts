import { test, expect, request, APIResponse } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiLogger } from '../utils/apiLogger';
import { UserSession } from '../utils/userSession';
import { sendApiRequest } from '../utils/sendApiRequest';
import { buildRequestData } from '../utils/buildRequestData';

const helper = new ApiHelper();
const env = helper.getEnvConfig();

test.describe('Account API Suite', () => {
  let session: UserSession;

  test.beforeEach(async () => {
    session = new UserSession();
    await session.init();
  });

  test.afterEach(async () => {
    console.log('Cleaning up after test...');
    await session.deleteUser();
    await session.dispose();
  });

  const scenarios = helper.getScenarios().filter((s: { id: string }) => s.id <= 'TC009');

  for (const scenario of scenarios) {
    const runTest = scenario.skip ? test.skip : test;

    runTest(`${scenario.id} - ${scenario.description}`, async () => {
      let userId = '';
      let token = '';

      const context = await request.newContext({
        baseURL: env.baseUrl,
        extraHTTPHeaders: env.headers,
      });

      const { endpoint, headers, body } = await buildRequestData(scenario, session);

      ApiLogger.logRequest(scenario, env.baseUrl, endpoint, headers, body);

      const response = await sendApiRequest(context, scenario.method, endpoint, headers, body);

      await ApiLogger.logResponse(response);

      const expectedStatus = scenario.expected.status;
      expect(response.status()).toBe(expectedStatus);
      console.warn(`THIS CURRENT CODE:: ${response.status()}`);
      console.warn(`THIS EXPECTED CODE:: ${expectedStatus}`);

      const json = await response.json().catch(() => ({}));
      console.warn(`THIS JSON:: ${json}`);

      if (scenario.expected.schemaKeys) {
        for (const key of scenario.expected.schemaKeys) {
          expect(json).toHaveProperty(key);
        }
      }
      console.log(`${scenario.id} - ${scenario.description} passed`);
    });
  }
});
