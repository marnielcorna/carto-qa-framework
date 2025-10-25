import { Locator, Page, expect } from "@playwright/test";

export class LoginPage{
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    constructor(private page: Page){
        this.usernameInput = page.locator('//*[@id="username"]')
        this.passwordInput = page.locator('//*[@id="password"]')
        this.submitButton = page.locator('//button[contains(text(), "Continue")]')
    }

    async open(){
        await this.page.goto(`${process.env.UI_BASE_URL}`)
    }

    async login(username: string, password: string){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
        console.log("ENTRAMOS??")
        await this.page.waitForLoadState('networkidle');
    }
}