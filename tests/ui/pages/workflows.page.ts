import { Page, expect } from '@playwright/test';

export class WorkflowPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/workflows');
    await expect(this.page.getByTestId('workflow-editor')).toBeVisible();
  }

  async addDataset(datasetName: string) {
    await this.page.getByPlaceholder('Search').fill(datasetName);
    await this.page.keyboard.press('Enter');
    await expect(this.page.locator(`text=${datasetName}`)).toBeVisible();
  }

  async connectSources(main: string, secondary: string) {
    // Simula drag-and-drop (desde dataset a Spatial Join)
    const mainNode = this.page.locator(`[data-testid="rf__node-${main}"]`);
    const secondaryNode = this.page.locator(`[data-testid="rf__node-${secondary}"]`);
    await mainNode.dragTo(secondaryNode);
  }

  async runWorkflow() {
    await this.page.getByTestId('run-button').click();
    await expect(this.page.getByText('Workflow execution completed successfully')).toBeVisible();
  }

  async verifyResultsTable() {
    const table = this.page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.locator('th')).toContainText(['name', 'city_joined', 'revenue_joined']);
  }
}
