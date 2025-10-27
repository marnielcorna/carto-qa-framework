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
  get searchBarSources() { return this.getSelector('//input[@placeholder="Search"]'); }
  get searchBarComponent() { return this.getSelector('//input[@placeholder="Search component"]'); }
  get componentsTab() { return this.getSelector('//button[contains(text(),"Components")]'); }
  get untitledWorkflowMenu() { return this.getSelector('//*[contains(text(),"Untitled")]/../..//*[@aria-label="workflow-actions-menu"]'); }
  get untitledWorkflowMenuOptionDelete() { return this.getSelector('//*[contains(text(),"Delete")]'); }
  get deleteConfirmationPopUp() { return this.getSelector('//*[contains(text(),"Delete workflow")]'); }
  get deleteConfirmationPopUpButtonYes() { return this.getSelector('//*[contains(text(),"Yes, delete")]'); }
  
  get spatialMatchCheckbox() { return this.getSelector('//*[contains(text(),"Output Intersection Object (Intersects Only)")]/..//input'); }
  get itemInSpatialMatchToBeVisible() { return this.getSelector('(//li[@role="menuitem" and contains(text(),"geom")])[1]'); }
  get simpleFilterDropdown() { return this.getSelector('(//li[contains(text(), "cartodb_id")]/..)[1]'); }
  
  get runButton() { return this.getSelector('//button//*[contains(text(),"Run")]'); }

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
    this.canvas = new (require('./components/canvas.component').CanvasComponent)(this.page);

    await expect(this.editorReady).toBeVisible({timeout: 15000});
    
  }

  async openDataBaseList() {
    await super.waitUntilVisible(this.sideBarConnectionDataOption);
    await super.safeClick(this.sideBarConnectionDataOption);
    await super.waitUntilVisible(this.connectionDataBreadcrumb);
  }

  async openDataBase(db: string) {
    await super.safeClick(this.getItemListedInSearchBar(db));
    await super.waitUntilVisible(this.demoDataBreadcrumb);
  }

  async openDataBaseSchema(schema: string) {
    await super.safeClick(this.getItemListedInSearchBar(schema));
    await super.waitUntilVisible(this.demoTablesBreadcrumb);
  }
  
  async searchSources(item: string) {
    await super.safeType(this.searchBarSources, item);
    await super.safeType(this.searchBarSources, item);
    await super.pressKey('Enter');
  }

  async searchComponents(item: string) {
    await super.safeType(this.searchBarComponent, item);
    await super.safeType(this.searchBarComponent, item);
    await super.pressKey('Enter');
  }

  async addSourcesToCanvas(item: string, quadrant = 1) {
    await this.searchSources(item);
    await this.canvas.dropElement(item, quadrant);
    await super.waitUntilVisible(this.searchItemInPanelIsLoaded(item));
  }
  async addComponentsToCanvas(item: string, quadrant = 1) {
    await this.searchComponents(item);
    await this.canvas.dropElement(item, quadrant);
    await super.waitUntilVisible(this.componentItemInPanelIsLoaded(item));
  }

  async linkComponent(type: string, from: string, to: string, targetHandle: string) {
    await this.canvas.linkSourceElement(type, from, to, targetHandle);
  }

  async selectComponentsTab(){
    await super.safeClick(this.componentsTab);
  }
  
  async deleteLastMap(){
    await super.open('/workflows');
    await super.safeClick(this.untitledWorkflowMenu);
    await super.safeClick(this.untitledWorkflowMenuOptionDelete);
    await super.waitUntilVisible(this.deleteConfirmationPopUp);
    await super.safeClick(this.deleteConfirmationPopUpButtonYes);
  }

  async sendParametersToComponent(component: string){
    await super.safeClick(this.getItemDisplayedInCanvaBoard(component));
    switch(component){
      case 'Spatial Match':
        await expect(this.itemInSpatialMatchToBeVisible).toBeVisible({timeout: 20000});
        await super.safeClick(this.spatialMatchCheckbox);
        await super.closeComponentPanel();
        break;
      case 'Simple Filter':
        await expect(this.simpleFilterDropdown).toBeVisible({timeout: 30000});
        await this.simpleFilterDropdown.click();
        await super.selectOptionInDropdown(component);
        await super.closeComponentPanel();
        break;
        case 'Create Builder Map':
        //
        break;
      default: break;
    }
  }

  async validateScenarioValidations(validations: any[]) {
  for (const val of validations) {
    switch (val.type) {
      case 'elementVisible':
        await expect(this.page.locator(val.selector)).toBeVisible({ timeout: 10000 });
        break;

      case 'textContains':
        await expect(this.page.locator(val.selector)).toContainText(val.expected);
        break;

      case 'textEquals':
        await expect(this.page.locator(val.selector)).toHaveText(val.expected);
        break;

      case 'countEquals':
        await expect(this.page.locator(val.selector)).toHaveCount(Number(val.expected));
        break;

      default:
        break;
    }
  }
}

}
