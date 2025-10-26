import { expect, Locator, Page } from '@playwright/test';
import { NavbarComponent } from './components/navbar.component';

export class BasePage {
  protected readonly page: Page;
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page);
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async waitUntilVisible(locator: Locator, timeout = 10000) {
    await expect(locator).toBeVisible({ timeout });
  }

  async safeClick(locator: Locator, timeout = 10000) {
    await this.waitUntilVisible(locator, timeout);
    await locator.click();
  }

  async waitUntilEnabled(locator: Locator, timeout = 10000) {
    await expect(locator).toBeEnabled({ timeout });
  }
  
  async waitForNewTab(action: Promise<any>): Promise<Page> {
    console.log("Waiting for new Tab.")

    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      action,
    ]);

    console.log("New Tab detected with URL:", newPage.url());

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

}
