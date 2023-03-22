import { test as base } from '@playwright/test';
import { SearchVideoSteps } from '../steps/searchVideoSteps';

type SearchVideoFixture = {
    searchVideoSteps: SearchVideoSteps
};

export const test = base.extend<SearchVideoFixture>({
    searchVideoSteps: async ({ page }, use) => {
        const searchVideoSteps = new SearchVideoSteps(page, 2);
        await page.goto(searchVideoSteps.searchVideoURL);
        await searchVideoSteps.makeSearchRequest('ураган')
        await use(searchVideoSteps);
    },
});
export { expect } from '@playwright/test';
