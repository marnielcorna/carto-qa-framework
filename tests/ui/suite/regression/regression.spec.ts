import { expect, test } from '@playwright/test';
import { WorkflowPage } from '../../pages/workflows.page';
import { loadWorkflowScenarios } from '../../utils/scenarioLoader';

const scenarios = loadWorkflowScenarios('regression');

for (const scenario of scenarios) {
  test.describe(`${scenario.metadata.id} - ${scenario.metadata.name}`, () => {

    test(`Execute scenario [${scenario.metadata.tags}]`, async ({ page }) => {
      const workflow = new WorkflowPage(page);

      console.log(`Starting scenario: ${scenario.metadata.id} - ${scenario.metadata.name}`);

      await workflow.open();
      await expect(page).toHaveURL('https://clausa.app.carto.com/workflows');

      await workflow.openNewWorkflow();
      await workflow.openDataBaseList();

      await workflow.openDataBase(scenario.context.database);
      await workflow.openDataBaseSchema(scenario.context.schema);

      // Sources
      for (const node of scenario.nodes.filter(n => n.type === 'source')) {
        await workflow.addSourcesToCanvas(node.name, node.quadrant);
      }

      // Components
      await workflow.selectComponentsTab();
      for (const node of scenario.nodes.filter(n => n.type === 'component')) {
        await workflow.addComponentsToCanvas(node.name, node.quadrant);
      }

      // Connections
      for (const connection of scenario.connections) {
        await workflow.linkComponent(connection.type, connection.from, connection.to, connection.targetHandle);
      }

      for (const node of scenario.nodes.filter(n => n.type === 'component')) {
        await workflow.sendParametersToComponent(node.name);
      }

      // Validations
      // if (scenario.validations) {
      //   await workflow.validateScenarioValidations(scenario.validations);
      // }

      console.log(`Finished scenario: ${scenario.metadata.id}`);
    });

  });
}
