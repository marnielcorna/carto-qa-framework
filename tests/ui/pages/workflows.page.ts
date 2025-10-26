import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './Base.page';
import { promises } from 'dns';

export class WorkflowPage extends BasePage {
  readonly workflowPageTitle: Locator = this.page.locator('//h5[contains(text(),"Workflows")]');
  readonly newWorkflowButton: Locator = this.page.locator('//button//*[contains(text(),"New workflow")]');
  readonly createNewOptionInDropdown: Locator = this.page.locator('//div//span[contains(text(),"Create new")]');

  constructor(page: Page) {
    super(page);
  }

  async open() {
    super.open('/workflows');
    expect(super.waitUntilVisible(this.workflowPageTitle));
  }
  
  async openNewWorkflow(): Promise<Page> {
    console.log("Opening new workflow flow.")

    await this.newWorkflowButton.isVisible();
    await this.newWorkflowButton.click();
    super.waitUntilVisible(this.createNewOptionInDropdown);
    
    const newWorkflowPage = await this.waitForNewTab(
      this.createNewOptionInDropdown.click()
    );
    
    console.log("HAS URL?? BEGIN")
    await expect(newWorkflowPage).toHaveURL(/workflows\/[a-zA-Z0-9_-]+/);
    console.log("HAS URL?? EXIT")
    return newWorkflowPage;
  }
}
