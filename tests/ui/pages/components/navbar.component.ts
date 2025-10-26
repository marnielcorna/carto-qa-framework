import { Locator, Page, expect } from '@playwright/test';

export class NavbarComponent {
    readonly page: Page;

    readonly homeLink: Locator;
    readonly workflowsLink: Locator;
    readonly mapsLink: Locator;

    constructor(page: Page) {
    this.page = page;

    this.homeLink = page.locator('//ul[contains(@class,"MuiList")]//*[contains(text(),"Home")]');
    this.mapsLink = page.locator('//ul[contains(@class,"MuiList")]//span[contains(text(),"Maps")]');
    this.workflowsLink = page.locator('//ul[contains(@class,"MuiList")]//*[contains(text(),"Workflows")]');
    }

    async goToHome() {
    await this.homeLink.click();
    }
    
    async goToMaps() {
    await this.mapsLink.click();
    await expect(this.page).toHaveURL(/.*maps/);
    }

    async goToWorkflows() {
    await this.workflowsLink.click();
    await expect(this.page).toHaveURL(/.*workflows/);
    }
}
