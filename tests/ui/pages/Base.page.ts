import { expect, Locator, Page } from '@playwright/test';
import { NavbarComponent } from './components/navbar.component';
import { CanvasComponent } from './components/canvas.component';

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
  

  async pressKey(key: string){
    await this.page.keyboard.press(key);
  }
}
