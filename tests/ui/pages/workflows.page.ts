import { Page, expect } from '@playwright/test';
import { BasePage } from './Base.page';

export class WorkflowPage extends BasePage {
  get workflowPageTitle() { return this.getSelector('//h5[contains(text(),"Workflows")]'); }
  get newWorkflowButton() { return this.getSelector('//button//*[contains(text(),"New workflow")]'); }
  get createNewOptionInDropdown() { return this.getSelector('//div//span[contains(text(),"Create new")]'); }
  get editorReady() { return this.getSelector('//*[@data-testid="workflow-editor"]'); }
  get sideBarConnectionDataOption() { return this.getSelector('//*[@data-testid="connection-data-button"]//*[contains(text(),"Connection data")]'); }
  get connectionDataBreadcrumb() { return this.getSelector('//*//p[contains(text(),"/ Connection Data")]'); }
  get demoDataBreadcrumb() { return this.getSelector('//*//p[contains(text(),"/ demo data")]'); }
  get demoTablesBreadcrumb() { return this.getSelector('//*//p[contains(text(),"/ demo_tables")]'); }
  get sideBarSearchBar() { return this.getSelector('//*[@data-testid="workflow-explorer-search"]//input[@placeholder="Search"]'); }

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await super.open('/workflows');
    await super.waitUntilVisible(this.workflowPageTitle);
  }
  
  async openNewWorkflow(): Promise<void> {
    console.log('Opening new workflow Tab.');

    await super.safeClick(this.newWorkflowButton);
    await super.waitForDomLoad();
    await super.waitUntilVisible(this.createNewOptionInDropdown);

    const newPage = await this.waitForNewTab(
      this.createNewOptionInDropdown.click()
    );

    await newPage.waitForLoadState('domcontentloaded');
    await expect(newPage).toHaveURL(/workflows\/[a-zA-Z0-9_-]+/);

    this.page = newPage;

    await expect(this.editorReady).toBeVisible({timeout: 15000});
  }

  async openDataBaseList() {
    await super.waitUntilVisible(this.sideBarConnectionDataOption);
    await super.safeClick(this.sideBarConnectionDataOption);
    await super.waitUntilVisible(this.connectionDataBreadcrumb);
  }

  async openDataBase(db: string) {
    await super.waitUntilVisible(this.connectionDataBreadcrumb);
    await super.safeClick(this.getItemListedInSearchBar(db));
  }

  async openDataBaseSchema(schema: string) {
    await super.waitUntilVisible(this.demoDataBreadcrumb);
    await super.safeClick(this.getItemListedInSearchBar(schema));
  }
  
  async selectAnduseDataset(dataset: string) {
    await super.waitUntilVisible(this.demoTablesBreadcrumb);
    await super.safeType(this.sideBarSearchBar, dataset);
    await super.pressKey('Enter');
    
    const datasetListed = this.getItemListedInSearchBar(dataset);

    await super.waitUntilVisible(datasetListed);

    //drag and drop.
    
    console.log('DONE??');
    //await super.waitUntilVisible(this.createNewOptionInDropdown);

  }
}
