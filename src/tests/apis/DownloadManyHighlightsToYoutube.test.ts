import { downloadManyHighlightsToYoutubeAPI } from "../../apis/DownloadManyHighlightsToYoutube.api"

downloadManyHighlightsToYoutubeAPI({
    url: "https://www.youtube.com/watch?v=jCh_mqXWpX0",
    highlights: [
        {start: "1:28:40", end: "1:28:46"},
        {start: "1:39:09", end: "1:39:24"},
        {start: "2:09:43", end: "2:09:50"},
        {start: "2:10:08", end: "2:10:24"},
        {start: "2:12:25", end: "2:12:38"},
        {start: "2:17:24", end: "2:17:36"},
        {start: "2:26:43", end: "2:27:07"},
        {start: "2:43:17", end: "2:43:44"},
    ],
    detail: {
        title: "Content Warning คอแตก",
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