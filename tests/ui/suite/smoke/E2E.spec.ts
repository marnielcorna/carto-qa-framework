import { expect, test } from '@playwright/test';
import { WorkflowPage } from '../../pages/workflows.page';
import { loadWorkflowScenarios } from '../../utils/scenarioLoader';
import { Env } from '../../../../config/env';

const scenarios = loadWorkflowScenarios('smoke');
const baseURL = Env.CARTO_BASE_URL;

for (const scenario of scenarios) {
  test.describe(`${scenario.metadata.id} - ${scenario.metadata.name}`, () => {
    test(`Execute scenario [${scenario.metadata.tags}]`, async ({ page }) => {
      const workflow = new WorkflowPage(page);

      console.log(`Starting scenario: ${scenario.metadata.id} - ${scenario.metadata.name}`);

      await workflow.open();
      await expect(page).toHaveURL(`${baseURL}/workflows`);

      await workflow.openNewWorkflow();
      await workflow.openDataBaseList();
      await workflow.openDataBase(scenario.context.database);
      await workflow.openDataBaseSchema(scenario.context.schema);

      console.log(`Finished scenario: ${scenario.metadata.id}`);
    });
  });
}
