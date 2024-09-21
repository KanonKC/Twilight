import { getVideoResolution } from "../../../services/videos/get-video-resolution"
import { videoResize } from "../../../services/videos/video-resize"

describe("VideoResize", () => {
    it("Should return a resized video 1920 x 1080", async () => {
        const resizedVideoFilename = await videoResize("twitch_02FbdhH0vs_BYHG.mp4", 1920, 1080)
        const resolution = await getVideoResolution(resizedVideoFilename.filename)
        expect(resolution).toEqual({ width: 1920, height: 1080 })
    })
    it("Should return a resized video 640 x 480", async () => {
        const resizedVideoFilename = await videoResize("twitch_02FbdhH0vs_BYHG.mp4", 640, 480)
        const resolution = await getVideoResolution(resizedVideoFilename.filename)
        expect(resolution).toEqual({ width: 640, height: 480 })
    })
})