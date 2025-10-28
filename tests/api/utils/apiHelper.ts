import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

export class ApiHelper {
  private testData: any;

  constructor() {
    const file = path.resolve(__dirname, '../data/api-testdata.json');
    this.testData = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  getEnv() {
    const baseUrl = process.env.API_URL?.trim();
    if (!baseUrl){
      throw new Error(`Invalid or missing API_URL. Got: "${baseUrl}"`);
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    console.log(`Using API base URL: ${baseUrl}`);
    return { baseUrl, headers };
  }

  getScenarios() {
    return this.testData.scenarios;
  }

  resolveBody(body: any) {
    if (typeof body === 'string' && body.startsWith('@')) {
      const pathParts = body.slice(1).split('.');
      let ref = this.testData;

      for (const part of pathParts) {
        if (ref[part] === undefined) {
          throw new Error(`Invalid reference in test data: ${body}`);
        }
        ref = ref[part];
      }

      return ref;
    }

    return body;
  }
  replacePlaceholders(data: any, userId: string, isbn: string = ''): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.replacePlaceholders(item, userId, isbn));
    }

    if (typeof data === 'object' && data !== null) {
      const newObj: any = {};
      for (const key in data) {
        const value = data[key];
        if (typeof value === 'string') {
          newObj[key] = value
            .replace('{UUID}', userId)
            .replace('{ISBN}', isbn);
        } else {
          newObj[key] = this.replacePlaceholders(value, userId, isbn);
        }
      }
      return newObj;
    }

    if (typeof data === 'string') {
      return data
        .replace('{UUID}', userId)
        .replace('{ISBN}', isbn);
    }

    return data;
  }

}
