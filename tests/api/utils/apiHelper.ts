import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class ApiHelper {
  testData: any;
  constructor() {
    const file = path.resolve(__dirname, '../data/api-testdata.json');
    this.testData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    this.resolveEnvVars(this.testData);
  }

  private resolveEnvVars(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.resolveEnvVars(obj[key]);
      } else if (typeof obj[key] === 'string' && obj[key].startsWith('${')) {
        const varName = obj[key].slice(2, -1);
        obj[key] = process.env[varName] || '';
      }
    }
  }

  getEnv() {
    return this.testData.environments.qa;
  }

  getScenarios() {
    return this.testData.scenarios;
  }

  resolveBody(body: any) {
  if (typeof body === 'string' && body.startsWith('@')) {
    const pathParts = body.slice(1).split('.');

    if (pathParts.length === 2) {
      const [ref, key] = pathParts;
      return this.testData[ref][key];
    }

    if (pathParts.length === 3) {
      const [group, sub, key] = pathParts;
      return this.testData[group][sub][key];
    }

    throw new Error(`Invalid body reference syntax: ${body}`);
  }

  return body;
}


}
