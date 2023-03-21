import { test, expect, Locator, Page } from "@playwright/test";
import { SearchSteps } from "./SearchSteps";
const PNG = require('pngjs').PNG;
import pixelmatch from 'pixelmatch';

export class SearchVideoSteps extends SearchSteps {

    readonly searchVideoURL: string;
    private readonly videoResult: Locator;
    private readonly thumbnailContainer: Locator;
    private readonly thumbnailImage: Locator;
    private readonly thumbnailVideo: Locator;
    private readonly thumbnailPreviewLoader: Locator;
    private readonly previewPlayingContainer: Locator;

    constructor(page: Page, thumbnailNumber: number) {
        super(page);
        this.searchVideoURL = '/video';
        this.videoResult = page.locator(`div.serp-list__items div.serp-item:nth-child(${thumbnailNumber})`);
        this.thumbnailContainer = this.videoResult.locator('.thumb-image');
        this.thumbnailImage = this.thumbnailContainer.locator('img.thumb-image__image');
        this.thumbnailVideo = this.thumbnailContainer.locator('.thumb-preview__video');
        this.thumbnailPreviewLoader = this.thumbnailContainer.locator('div.thumb-preview__target_loading');
        this.previewPlayingContainer = this.thumbnailContainer.locator('div.thumb-preview__target_playing');
    }

    async checkPlayingVideoOnHover() {
        await test.step('Chech hover and video is playing', async () => {
            await expect(this.videoResult).toBeVisible();
            await expect(this.thumbnailImage).toBeVisible();

            // Check that video is not playing
            await this.checkVideoIsNotPlaying();

            // Hover and wait loading
            await this.hoverAndWaitingLoader();

            // Check option #1 (is just <video> tag visible?)
            await expect(this.thumbnailVideo).toBeVisible();
            // Check option #2 (is video tag visible by css styles?)
            await expect(this.thumbnailVideo).toHaveCSS('display', 'block');
            // Check option #3 (is parent tag has css class during playing video?)
            await expect(this.previewPlayingContainer).toBeVisible();
        });
    }


    async checkVideoIsNotPlaying() {
        await test.step('Chech video isn\'t playing and isn\'t exist at DOM ', async () => {
            // Check that video selector is not exist at the DOM  
            await expect(this.thumbnailVideo).toBeHidden()

            // Check that parent tag has no css class (as selector)
            await expect(this.previewPlayingContainer).toBeHidden()
        });
    }
    async hoverAndWaitingLoader() {
        await test.step('Hover and wait for loading', async () => {
            // Hover and wait loading
            await this.thumbnailContainer.hover();
            await expect(this.thumbnailPreviewLoader).toBeVisible();
            await expect(this.thumbnailPreviewLoader).toBeHidden();
        });
    }

    async checkPlayingVideoByBoundingBox() {
        await test.step('Honest check', async () => {
            const originalBox = await this.thumbnailImage.boundingBox();
            await this.hoverAndWaitingLoader()
            const newBox = await this.thumbnailVideo.boundingBox();
            expect.soft(newBox?.x).toEqual(originalBox?.x);
            expect.soft(newBox?.width).toEqual(originalBox?.width);
            // Just for demonstrating
            // Next checking doesn't work, because there are different height of img and video
            // expect.soft(newBox?.y).toEqual(originalBox?.y);
            // expect.soft(newBox?.height).toEqual(originalBox?.height);

            expect(test.info().errors).toHaveLength(0);
        });
    }

    async checkPlayingVideoByEval() {
        await test.step('Check playing video by eval', async () => {
            await this.hoverAndWaitingLoader()
            const isPlaying = await this.videoResult.locator('video')
                .evaluate((el: any) => !el.paused && el.currentTime > 0 && !el.ended && el.readyState > 2);
            expect(isPlaying).toBe(true);
        });
    }

    async checkPLayingVideoByScreenshots() {
        await test.step('Check playing video by comparing screenshots of element', async () => {
            const beforeScreenshot = await this.thumbnailContainer.screenshot({ path: './screenshot/before_hover.png', });
            const img1 = await PNG.sync.read(beforeScreenshot);

            await this.hoverAndWaitingLoader();
            await this.page.evaluate(() => { })
            await expect(this.previewPlayingContainer).toBeVisible();

            const afterScreenshot = await this.thumbnailContainer.locator('.thumb-image__background') // just for using new locator
                .screenshot({ path: './screenshot/after_hover.png', });
            const img2 = await PNG.sync.read(afterScreenshot);

            const diff = new PNG({ width: img1.width, height: img1.height });
            const difference = pixelmatch(
                img1.data,
                img2.data,
                diff.data,
                img1.width,
                img1.height,
                { threshold: 0.1 }
            );

            expect(difference).not.toBe(0);
        });
    }
}
