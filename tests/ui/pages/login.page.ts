import { Locator, Page } from '@playwright/test';
import { BasePage } from './Base.page';
import { Env } from '../../../config/env';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly orgUrl: string;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('//*[@id="username"]');
    this.passwordInput = page.locator('//*[@id="password"]');
    this.submitButton = page.locator('//button[contains(text(), "Continue")]');
    this.orgUrl = Env.UI_CONFIG.cartoUrl;
  }

  async open() {
    await super.open(Env.UI_CONFIG.baseUrl);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL(this.orgUrl, { timeout: 30000 });
  }
}
