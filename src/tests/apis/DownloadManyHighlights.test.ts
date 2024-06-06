import { downloadManyHighlightsAPI } from "../../apis/DownloadManyHighlight.api"

// downloadManyHighlightsAPI({
//     url: "https://www.youtube.com/live/5WjlJE5xh1I",
//     highlights: [
//         // {start: "2:49:11", end: "2:50:13"},
//         // {start: "3:21:38", end: "3:21:51"},
//         {start: "3:29:13", end: "3:29:35"},
//     ]
// }).then(response => {
//     console.log("Download Completed")
//     console.log(response)
// })

// downloadManyHighlightsAPI({
//     url: "https://www.youtube.com/live/ecAVCfhT3NE",
//     highlights: [
//         // {start: "2:49:11", end: "2:50:13"},
//         // {start: "3:21:38", end: "3:21:51"},
//         {start: "2:30:05", end: "2:30:18"},
//     ]
// }).then(response => {
//     console.log("Download Completed")
//     console.log(response)
// })

// downloadManyHighlightsAPI({
//     url: "https://www.youtube.com/live/FjjGGcEViRY",
//     highlights: [
//         // {start: "2:49:11", end: "2:50:13"},
//         // {start: "3:21:38", end: "3:21:51"},
//         {start: "1:51:54", end: "1:52:03"},
//     ]
// }).then(response => {
//     console.log("Download Completed")
//     console.log(response)
// })

downloadManyHighlightsAPI({
    url: "https://www.youtube.com/live/B4bGRVFMtm0",
    highlights: [
        // {start: "2:49:11", end: "2:50:13"},
        // {start: "3:21:38", end: "3:21:51"},
        {start: "1:08:57", end: "1:09:04"},
        {start: "1:14:22", end: "1:14:52"},
    ]
}).then(response => {
    console.log("Download Completed")
    console.log(response)
})