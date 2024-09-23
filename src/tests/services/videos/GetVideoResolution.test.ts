import { getVideoResolution } from "../../../services/videos/get-video-resolution"

describe("GetVideoResolution", () => {
    it("Should return 1920 x 1080", async () => {
        const resolution = await getVideoResolution("twitch_Q76O9WwOmr_na1y.mp4")
        expect(resolution).toEqual({ width: 1920, height: 1080 })
    })
    it("Should return 1280 x 720", async () => {
        const resolution = await getVideoResolution("twitch_02FbdhH0vs_BYHG.mp4")
        expect(resolution).toEqual({ width: 1280, height: 720 })
    })
    it("Should return 1152 x 648", async () => {
        const resolution = await getVideoResolution("twitch_1957517932_YTmu.mp4")
        expect(resolution).toEqual({ width: 1152, height: 648 })
    })
})