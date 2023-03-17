import { test, expect, Locator, Page } from "@playwright/test";
import { SearchSteps } from "./SearchSteps";

export class SearchVideoSteps extends SearchSteps {

    private readonly firstVideoResult: Locator;
    private readonly firstThumbnailContainer: Locator;
    private readonly firstThumbnailImage: Locator;
    private readonly firstThumbnailVideo: Locator;
    private readonly firstThumbnailPreviewLoader: Locator;
    private readonly firstPreviewPlayingContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.firstVideoResult = page.locator('div.serp-list__items div.serp-item').first()
        this.firstThumbnailContainer = this.firstVideoResult.locator('.thumb-image')
        this.firstThumbnailImage = this.firstThumbnailContainer.locator('img.thumb-image__image')
        this.firstThumbnailVideo = this.firstThumbnailContainer.locator('.thumb-preview__video')
        this.firstThumbnailPreviewLoader = this.firstThumbnailContainer.locator('div.thumb-preview__target_loading')
        this.firstPreviewPlayingContainer = this.firstThumbnailContainer.locator('div.thumb-preview__target_playing')
    }

    async checkPlayingVideoOnHover() {
        await test.step('Chech hover and video is playing', async () => {
            await expect(this.firstVideoResult).toBeVisible()
            await expect(this.firstThumbnailImage).toBeVisible()

            // Check that video is not playing 
            await this.checkVideoIsNotPlaying()

            // Hover and wait loading 
            await this.firstThumbnailContainer.hover()
            await expect(this.firstThumbnailPreviewLoader).toBeVisible()
            await expect(this.firstThumbnailPreviewLoader).toBeHidden()

            // Check option #1 (is just <video> tag visible?)
            await expect(this.firstThumbnailVideo).toBeVisible()
            // Check option #2 (is video tag visible by css styles?)
            await expect(this.firstThumbnailVideo).toHaveCSS('display', 'block')
            // Check option #3 (is parent tag has css class during playing video?)
            await expect(this.firstPreviewPlayingContainer).toBeVisible()
        });
    }

    async checkVideoIsNotPlaying() {
        await test.step('Chech video isn\'t playing and isn\'t exist at DOM ', async () => {
            // Check that video selector is not exist at the DOM  
            await expect(this.firstThumbnailVideo).toBeHidden()

            // Check that parent tag has no css class (as selector)
            await expect(this.firstPreviewPlayingContainer).toBeHidden()
        });
    }
}
