import config from "../../configs";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import YtDlp from "../../externals/yt-dlp/yt-dlp";

const ytDlp = new YtDlp()
const ffmpeg = new FFmpeg(config)

async function downloadWithResolution(url: string) {
 
    const video = await ytDlp.downloadYoutubeVideo(url,{
        range: {
            start: "1:00",
            end: "1:10"
        },
        path: "dumps",
        resolution: {
            width: 1920,
            height: 1080
        }
    })
    const resolution = await ffmpeg.getVideoResolution(video.filename)
    return resolution
}

// describe("YtDlp", () => {
//     it("Should return video with 1920 x 1080 resolution #1", async () => {
//         const resolution = await downloadWithResolution('https://www.youtube.com/live/uxroBOqkr90')
//         expect(resolution).toEqual({ width: 1920, height: 1080 })
//     }, 10000)

//     it("Should return video with 1920 x 1080 resolution #2", async () => {
//         const resolution = await downloadWithResolution('https://www.youtube.com/live/uxroBOqkr90')
//         expect(resolution).toEqual({ width: 1920, height: 1080 })
//     }, 10000)
// })

// https://www.youtube.com/live/uxroBOqkr90

(async () => {
    const ytDlp = new YtDlp()
    const ffmpeg = new FFmpeg(config)
    const video = await ytDlp.downloadYoutubeVideo('https://www.youtube.com/live/uxroBOqkr90',{
        range: {
            start: "1:29:00",
            end: "1:29:10"
        },
        path: "dumps",
    })
    const resolution = await ffmpeg.getVideoResolution(video.filename)
    console.log(video)
    console.log(resolution)
})()

// (async () => {
//     const ytDlp = new YtDlp()
//     const ffmpeg = new FFmpeg(config)
//     const video = await ytDlp.downloadYoutubeVideo('https://www.youtube.com/watch?v=c2M0x2DZ_yc',{
//         range: {
//             start: "19:00",
//             end: "19:10"
//         },
//         path: "dumps",
//     })
//     const resolution = await ffmpeg.getVideoResolution(video.filename)
//     console.log(video)
//     console.log(resolution)
// })()

