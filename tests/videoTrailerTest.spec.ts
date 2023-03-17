import { SearchVideoSteps } from "../steps/searchVideoSteps";
import { chromium, Page, test } from "@playwright/test"

let page: Page;
test.describe('Yandex search -> Video', () => {

    test.beforeAll(async () => { // Just for fixing Codecs locally for all tests in this file 
        const context = await chromium.launch({ channel: 'chrome' });
        page = await context.newPage()
    });

    test.beforeEach(async () => { // for all feature tests with video 
        await page.goto('/video')
    });

    test('Check hover: playing video, and unhover: not playing', async () => {
        const searchVideoSteps = new SearchVideoSteps(page)

        await searchVideoSteps.makeSearchRequest('ураган')
        await searchVideoSteps.checkPlayingVideoOnHover()
        await searchVideoSteps.hoverToInputField()
        await searchVideoSteps.checkVideoIsNotPlaying()
    });
});
