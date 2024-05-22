import { videoTrim } from "../services/video-trim"
import { youtubeDownload } from "../services/youtube-download"

youtubeDownload("https://www.youtube.com/watch?v=ng5Cq2YEaRU").then((video) => {
    console.log("Download completed, trimming video ...")
    console.log(video)
    videoTrim(video, 5, 7).then((result) => {
        console.log("Done")
        console.log(result)
    })
})