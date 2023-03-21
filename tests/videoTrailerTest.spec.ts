import { test } from "../fixtures/YandexFixture"

test.describe('Yandex search -> Video', async () => {

    test('Check hover: playing video, and unhover: not playing', async ({ searchVideoSteps }) => {
        await searchVideoSteps.checkPlayingVideoOnHover()
        await searchVideoSteps.hoverToInputField()
        await searchVideoSteps.checkVideoIsNotPlaying()
    });

    test('Check hover and playing video: by BoundingBox', async ({ searchVideoSteps }) => {
        await searchVideoSteps.checkPlayingVideoByBoundingBox()
    });

    test('Check hover and playing video: by eval', async ({ searchVideoSteps }) => {
        await searchVideoSteps.checkPlayingVideoByEval()
    });

    test('Check hover and playing video: by screenshot', async ({ page, searchVideoSteps }) => {
        await searchVideoSteps.checkPLayingVideoByScreenshots()
    });
});
