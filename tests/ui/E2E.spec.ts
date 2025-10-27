import { test } from '@playwright/test';
import { WorkflowPage } from './pages/workflows.page';
import { loadWorkflowScenarios } from './utils/scenarioLoader';

const scenarios = loadWorkflowScenarios();
for (const scenario of scenarios){
  test.describe('Create Map Builder Test', () => {
    test('User creates and runs workflow successfully', async ({ page }) => {
      const workflow = new WorkflowPage(page);

      await workflow.open();
      await workflow.openNewWorkflow();
      await workflow.openDataBaseList();
      await workflow.openDataBase(scenario.context.database);
      await workflow.openDataBaseSchema(scenario.context.schema);

      for (const node of scenario.nodes.filter(n=> n.type === 'source')){
        await workflow.addSourcesToCanvas(node.name, node.quadrant);
      }
      await workflow.selectComponentsTab();

      for (const node of scenario.nodes.filter(n=> n.type === 'component')){
        await workflow.addComponentsToCanvas(node.name, node.quadrant);
      }
      
      for (const connection of scenario.connections){
        await workflow.linkComponent(connection.type, connection.from, connection.to, connection.targetHandle);
      }
      
      await workflow.deleteLastMap();
      await workflow.testdos();

      console.log('FINISHED TEST');

    });
  });
}
