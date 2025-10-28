export class ApiLogger {
  static logRequest(scenario: any, baseUrl: string, endpoint: string, headers: any, body?: any) {
    console.log('\n============REQUEST==============');
    console.log(`TEST: ${scenario.id} - ${scenario.description}`);
    console.log(`URL: ${baseUrl}${endpoint}`);
    console.log(`METHOD: ${scenario.method}`);
    console.log('HEADERS:', JSON.stringify(headers, null, 2));
    if (body) {
      console.log(`BODY:\n ${JSON.stringify(body, null, 2)}`);
    } else {
      console.log('BODY: -');
    }
  }

  static async logResponse(response: any) {
    const status = response.status();
    const headers = await response.headers();
    const text = await response.text().catch(() => '');
    console.log('============RESPONSE==============');
    console.log('RESPONSE');
    console.log('STATUS:', status);
    console.log('HEADERS:', JSON.stringify(headers, null, 2));
    console.log(`BODY:\n ${text}`);
  }

  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static error(message: string, error?: any) {
    console.log(`[ERROR] ${message}`);
    if (error) console.log(error);
  }
}
