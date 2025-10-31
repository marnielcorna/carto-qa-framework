import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { Env } from '../../config/env';

setup('authenticate', async ({ page }) => {
  const username = Env.UI_CONFIG.username;
  const password = Env.UI_CONFIG.password;
  const orgUrl = Env.UI_CONFIG.cartoUrl;

  const login = new LoginPage(page);
  await login.open();
  await login.login(username, password);

  await page.waitForURL(orgUrl);
  await page.context().storageState({ path: 'auth.json' });
});
