import { expect, Locator, Page } from '@playwright/test';
import { NavbarComponent } from './components/navbar.component';
import { CanvasComponent } from './components/canvas.component';
import { it } from 'node:test';

export class BasePage {
  protected page: Page;
  readonly navbar: NavbarComponent;
  canvas: CanvasComponent;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page);
    this.canvas = new CanvasComponent(page);

  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async waitUntilVisible(locator: Locator, timeout = 30000) {
    await expect(locator).toBeVisible({ timeout });
  }
  
  async safeClick(locator: Locator, timeout = 30000) {
    await this.waitUntilVisible(locator, timeout);
    await locator.click();
  }

  async safeType(locator: Locator, text: string, timeout = 30000) {
    await this.waitUntilVisible(locator, timeout);
    await locator.fill(text, { timeout });
    
  }

  async waitForDomLoad(timeout = 10000): Promise<void> {
  await this.page.waitForLoadState('domcontentloaded', { timeout });
}


  async waitUntilEnabled(locator: Locator, timeout = 30000) {
    await expect(locator).toBeEnabled({ timeout });
  }

  async waitUntilReady() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('nav')).toBeVisible({ timeout: 30000 });
  }

  async waitUntilDisappear() {
    const progressbar = this.page.locator('//div[contains(@class, "css-1usa9hx"")]');
    await progressbar.isHidden();
  }

  async delete(targetLocator: Locator, confirmLocator?: Locator) {
  await this.waitForNoOverlays();
  await this.safeClick(targetLocator);

  if (confirmLocator) {
    expect(confirmLocator).toBeVisible;
  }

  await this.waitExplicitly(1000, 'waiting for delete action to complete');
}

async waitForNoOverlays(timeout = 10000) {
  const overlay = this.page.locator('//div[contains(@class,"MuiDialog-container") or contains(@class,"MuiModal-root")]');
  try {
    await expect(overlay).toHaveCount(0, { timeout });
  } catch {
    console.log('Overlay detected, waiting to disappear...');
  }
}
  async waitExplicitly(milliseconds: number, reason = '') {
    if (reason) console.log(`Waiting ${milliseconds}ms: ${reason}`);
    await this.page.waitForTimeout(milliseconds);
  }
  
  async waitForNewTab(action: Promise<any>): Promise<Page> {
    console.log('Waiting for new Tab.');
    
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      action,
    ]);
    
    console.log('New Tab detected with URL:', newPage.url());
    
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  protected getSelector(selector: string): Locator {
    return this.page.locator(selector);
  }

  getItemListedInSearchBar(item: string) {
    return this.getSelector(`//*[@data-testid="data-explorer-list-item"]//p[contains(text(),"${item}")]`);
  }
  
  searchItemInPanelIsLoaded(item: string){
    return this.getSelector(`//h6[contains(text(),"${item}")]/../..//*[contains(@class, "css-61elv4")]`);
  }
  
  componentItemInPanelIsLoaded(item: string){
    return this.getSelector(`//*[contains(text(),"${item}")]/../../..//*[@data-variant]`);
  }

  getItemDisplayedInCanvaBoard(item: string){
    return this.getSelector(`//span[contains(text(),"${item}")]/ancestor::div[@data-testid="WorkflowGenericNodeBox"]`);
  }

  async closeComponentPanel(){
    const canvas = this.getSelector('//*[@data-testid="rf__wrapper"]')
    await this.safeClick(canvas);
  }

  async createAndWaitUntilsIsNotVisible(item: string, timeout = 10000) {
  const itemWithProgressBar = this.getSelector(`//h6[contains(text(),"${item}")]/../../..//span[@role="progressbar"]`);

  await this.waitUntilVisible(itemWithProgressBar);
  await expect(itemWithProgressBar).toBeHidden({ timeout });
  console.log(`Progress bar for "${item}" finished and hidden.`);
}

  
  async selectOptionInDropdown(option: string) {
    const dropdownOption = this.page.locator(`//li[contains(text(),"${option}")]`);
    await this.safeClick(dropdownOption);
  }


  async pressKey(key: string){
    await this.page.keyboard.press(key);
  }
}
