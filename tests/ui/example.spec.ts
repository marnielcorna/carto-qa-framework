import { test } from '@playwright/test';
import { WorkflowPage } from './pages/workflows.page';

test.describe('CARTO Workflow E2E', () => {
  test('User creates and runs workflow successfully', async ({ page }) => {
    const workflow = new WorkflowPage(page);
    await workflow.open(); // Ya autenticado gracias al auth.json
    await workflow.addDataset('retail_stores');
    await workflow.addDataset('usa_states_boundaries');
    await workflow.connectSources('retail_stores', 'usa_states_boundaries');
    await workflow.runWorkflow();
    await workflow.verifyResultsTable();
  });
});
