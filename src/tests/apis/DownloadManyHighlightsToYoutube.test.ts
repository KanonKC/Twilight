import { downloadManyHighlightsToYoutubeAPI } from "../../apis/DownloadManyHighlightsToYoutube.api"

downloadManyHighlightsToYoutubeAPI({
    url: "https://www.youtube.com/live/MpjmKaMnLbc",
    highlights: [
        {start: "0:24:08", end: "0:58:07"},
        {start: "0:58:50", end: "1:01:18"},
    ],
    detail: {
        title: "เล่าเรื่องผีตอน 2 ทุ่ม (เรื่องเต็ม Code 18)",
        privacyStatus: "private"
    }
}).then(response => {
    console.log("Upload Completed")
    console.log(response.videoId)
})

// downloadManyHighlightsToYoutubeAPI({
//     url: "https://www.youtube.com/live/mcz7ygkzuE4",
//     highlights: [
//         {start: "0:48:07", end: "0:48:19"},
//         {start: "0:48:39", end: "0:49:26"},
//     ],
//     detail: {
//         title: " Honest review for โล่ Pol",
//     }
// }).then(response => {
//     console.log("Upload Completed")
//     console.log(response.videoId)
// })