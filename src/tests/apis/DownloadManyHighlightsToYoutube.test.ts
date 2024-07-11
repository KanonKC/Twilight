import { downloadManyHighlightsToYoutubeAPI } from "../../apis/DownloadManyHighlightsToYoutube.api"

downloadManyHighlightsToYoutubeAPI({
    url: "https://www.youtube.com/live/4KRUizMYZms",
    highlights: [
        {start: "1:50:37", end: "2:05:40"},
        {start: "2:08:45", end: "2:21:35"},
    ],
    detail: {
        title: "เจอ MARK YOUR CHOICE 2 เกมติด",
        privacyStatus: "unlisted",
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