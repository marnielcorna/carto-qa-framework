import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { Env } from '../../config/env';

setup('authenticate', async ({ page }) => {
  const username = Env.UI_USERNAME;
  const password = Env.UI_PASSWORD;
  const orgUrl = Env.CARTO_BASE_URL;

  const login = new LoginPage(page);
  await login.open();
  await login.login(username, password);

  await page.waitForURL(orgUrl);
  await page.context().storageState({ path: 'auth.json' });
});
