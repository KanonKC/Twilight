
// twitchDownload("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
//     videoTrim(video,6,8).then((result) => {
//         console.log("-------------------------")
//         console.log(result)
//         console.log("-------------------------")
//     })
// })

import config from "../../configs";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import TwitchDl from "../../externals/twitch-dl/twitch-dl";
import YtDlp from "../../externals/yt-dlp/yt-dlp";
import DownloadService from "../../services/download/download.service";

// twitchDownload("https://www.twitch.tv/videos/1214826771").then((video) => {
//     videoTrim(video,6,8).then((result) => {
//         console.log("-------------------------")
//         console.log(result)
//         console.log("-------------------------")
//     })
// })

// describe("TwitchDownloadVideo", () => {
//     it("should download a video from Twitch", async () => {
//         const video = await twitchDownload("https://www.twitch.tv/videos/1214826771")
//         expect(video).haveOwnProperty("id")
//     })
//     it("should trim a video from Twitch", async () => {
//         const video = await twitchDownload("https://www.twitch.tv/videos/1214826771")
//         const trimmedVideo = await videoTrim(video,6,8)
//         expect(trimmedVideo).haveOwnProperty("id")
//         expect(trimmedVideo).haveOwnProperty("filename")
//         expect(trimmedVideo).haveOwnProperty("platform")
//         expect(trimmedVideo).haveOwnProperty("title")
//     })
// })

const twitchDl = new TwitchDl()
const ffmpeg = new FFmpeg(config)
const ytdlp = new YtDlp()

const ds = new DownloadService(twitchDl,ffmpeg,ytdlp,config)

ds.downloadRange("https://www.twitch.tv/videos/2523791153").then((video) => {
    console.log(video)
})

