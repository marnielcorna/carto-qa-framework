import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiLogger } from '../utils/apiLogger';
import { UserSession } from '../utils/userSession';
import { sendApiRequest } from '../utils/sendApiRequest';
import { buildRequestData } from '../utils/buildRequestData';

const helper = new ApiHelper();
const env = helper.getEnvConfig();

test.describe('BookStore API Suite', () => {
  let session: UserSession;

  test.beforeEach(async () => {
    session = new UserSession();
    await session.init();
  });

  test.afterEach(async () => {
    console.log('Cleaning up test...');
    await session.deleteUser();
    await session.dispose();
  });
  
  const scenarios = helper.getScenarios().filter((s: { id: string }) => s.id >= 'TC011' && s.id <= 'TC020');

  for (const scenario of scenarios) {
    const runTest = scenario.skip ? test.skip : test;

    runTest(`${scenario.id} - ${scenario.description}`, async () => {
      // Crear un nuevo contexto HTTP
      const context = await request.newContext({
        baseURL: env.baseUrl,
        extraHTTPHeaders: env.headers,
      });

      // Construir datos de request dinámicamente
      const { endpoint, headers, body } = await buildRequestData(scenario, session);

      ApiLogger.logRequest(scenario, env.baseUrl, endpoint, headers, body);

      // Ejecutar request
      const response = await sendApiRequest(context, scenario.method, endpoint, headers, body);

      // Log completo de respuesta
      await ApiLogger.logResponse(response);

      // Validación de código de estado
      const expectedStatus = scenario.expected.status;
      expect(response.status()).toBe(expectedStatus);
      console.warn(`THIS CURRENT CODE:: ${response.status()}`);
      console.warn(`THIS EXPECTED CODE:: ${expectedStatus}`);

      // Parsear JSON
      const json = await response.json().catch(() => ({}));
      console.warn(`THIS JSON:: ${JSON.stringify(json, null, 2)}`);

      // Validar esquema si existe
      if (scenario.expected.schemaKeys) {
        for (const key of scenario.expected.schemaKeys) {
          const altKey = key === 'userID' ? 'userId' : key;
          expect(json).toHaveProperty(altKey);
        }
      }

      console.log(`${scenario.id} - ${scenario.description} passed ✅`);
    });
  }
});
