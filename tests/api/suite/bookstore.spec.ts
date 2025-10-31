import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiLogger } from '../utils/apiLogger';
import { UserSession } from '../utils/userSession';
import { sendApiRequest } from '../utils/sendApiRequest';
import { buildRequestData } from '../utils/buildRequestData';

const helper = new ApiHelper();

test.describe('BookStore API Suite', () => {
  let session: UserSession;

  test.beforeEach(async () => {
    session = new UserSession();
    await session.init();
  });

  test.afterEach(async () => {
    console.log('Cleaning up test.');
    await session.deleteUser();
    await session.dispose();
  });

  const scenarios = helper.getScenarios().filter(
    (s: { id: string }) => s.id >= 'TC011' && s.id <= 'TC020'
  );

  for (const scenario of scenarios) {
    const runTest = scenario.skip ? test.skip : test;

    runTest(`${scenario.id} - ${scenario.description}`, async () => {
      const baseUrl = helper.getBaseUrl();
      const headers = helper.getHeaders();

      const context = await request.newContext({
        baseURL: baseUrl,
        extraHTTPHeaders: headers,
      });

      const { endpoint, headers: reqHeaders, body } = await buildRequestData(scenario, session);

      ApiLogger.logRequest(scenario, baseUrl, endpoint, reqHeaders, body);

      const response = await sendApiRequest(context, scenario.method, endpoint, reqHeaders, body);
      await ApiLogger.logResponse(response);

      expect(response.status()).toBe(scenario.expected.status);

      const json = await response.json().catch(() => ({}));

      if (scenario.expected.schemaKeys) {
        for (const key of scenario.expected.schemaKeys) {
          expect(json).toHaveProperty(key);
        }
      }

      console.log(`${scenario.id} - ${scenario.description} passed.`);
    });
  }
});
