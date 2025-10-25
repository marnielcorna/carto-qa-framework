import {test as setup} from '@playwright/test';
import { LoginPage } from './pages/login.page';

setup('authenticate', async({page})=>{
    const username: string = process.env.UI_USERNAME || '';
    const password: string = process.env.UI_PASSWORD || '';
    const orgUrl = 'https://clausa.app.carto.com/';

    const login = new LoginPage(page);
    await login.open();
    await login.login(username, password);
    
    await page.waitForURL(orgUrl);
    
    console.log("LLEGAMOS setup")
    await page.context().storageState({path: 'auth.json'})

})