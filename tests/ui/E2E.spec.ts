import { test } from '@playwright/test';
import { WorkflowPage } from './pages/workflows.page';

test.describe('Create Map Builder Test', () => {
  test('User creates and runs workflow successfully', async ({ page }) => {
    const workflow = new WorkflowPage(page);
    await workflow.open();
    await workflow.openNewWorkflow();
    await workflow.openDataBaseList();
    await workflow.openDataBase('demo data');
    await workflow.openDataBaseSchema('demo_tables');
    await workflow.selectAnduseDataset('retail_stores');
    //await workflow.selectAnduseDataset('retail_stores');

    console.log('FINISHED TEST');

  });
});
