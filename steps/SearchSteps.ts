import { test, expect, Locator, Page } from "@playwright/test";

export class SearchSteps {
    readonly page: Page;
    private readonly inputField: Locator;
    private readonly findButton: Locator;
    private readonly fadeBlur: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputField = page.locator('//span[@class="input__box"]//input') // xpath example
        this.findButton = page.getByRole('button', { name: 'Найти' }) // Playwright using example
        this.fadeBlur = page.locator('div.fade_progress_yes')  // css selector example
    }

    async makeSearchRequest(text: string) {
        await test.step('Make a search request: ' + text, async () => {
            await this.inputField.fill(text)
            await this.findButton.click()
            await this.waitForFadeBlurDisappear()
        });
    }

    async waitForFadeBlurDisappear() {
        await test.step('Wait for fade blur is disapear...', async () => {
            await expect(this.fadeBlur).toBeVisible()
            await expect(this.fadeBlur).toBeHidden()
            await this.fadeBlur.waitFor({ state: "hidden" })
        });
    }

    async hoverToInputField() {
        await test.step('Hover to input field', async () => {
            await this.inputField.hover()
        });
    }
}