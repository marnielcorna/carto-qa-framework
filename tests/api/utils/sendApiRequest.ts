import { APIRequestContext, APIResponse } from '@playwright/test';

export async function sendApiRequest(
  context: APIRequestContext,
  method: string,
  endpoint: string,
  headers: Record<string, string>,
  body?: any
): Promise<APIResponse> {
  switch (method.toUpperCase()) {
    case 'POST':
      return await context.post(endpoint, { data: body, headers });
    case 'GET':
      return await context.get(endpoint, { headers });
    case 'DELETE':
      return await context.delete(endpoint, { headers, data: body });
    case 'PUT':
      return await context.put(endpoint, { data: body, headers });
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
