import { downloadManyHighlightsAPI } from "../../apis/DownloadManyHighlight.api"

const payload = {
    url: "https://www.youtube.com/live/MjyvLwVjK1s",
    highlights: [
        {start: "0:47:44", end: "0:47:47"},
        {start: "0:48:44", end: "0:48:47"},
        {start: "0:49:44", end: "0:49:47"},
    ],
    concatVideo: true
}

downloadManyHighlightsAPI(payload).then(response => {
    console.log("Download Completed")
    const FULL_PATH = "C:/Users/user/Documents/Stream-Manage/Streaming-Content-Manager"
    
    console.log("Highlights")
    for(const highlight of response.highlights) {
        console.log(`${FULL_PATH}/${highlight.downloadVideo.filename}`)
    }

    if (response.concatVideo) {
        console.log("Concat")
        console.log(`${FULL_PATH}/${response.concatVideo?.filename}`)
    } 

})