import fs from 'fs';
import path from 'path';

export interface WorkflowScenario {
  metadata: {
    id: string;
    name: string;
    description?: string;
    priority?: string;
    tags?: string[];
  };
  context: {
    database: string;
    schema: string;
  };
  nodes: {
    type: string;
    name: string;
    quadrant: number;
  }[];
  connections: {
    type: string;
    from: string;
    to: string;
    targetHandle: string;
  }[];
  validations?: any[];
}

export function loadWorkflowScenarios(): WorkflowScenario[] {
  const scenariosDir = path.join(__dirname, '../data');
  const files = fs.readdirSync(scenariosDir).filter(f => f.endsWith('.json'));

  return files.map(file => {
    const fullPath = path.join(scenariosDir, file);
    const scenario = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return scenario as WorkflowScenario;
  });
}
