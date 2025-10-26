import {Locator, Page} from '@playwright/test';
import { BasePage } from './Base.page';

export class HomePage extends BasePage{
    readonly title: Locator;

    constructor(page: Page){
        super(page);
        this.title = page.locator('//*[contains(text(),"Welcome to CARTO")]');
    }
}