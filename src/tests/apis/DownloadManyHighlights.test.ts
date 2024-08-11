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

// console.log(__dirname)
// youtube_L1X5z3agHRE_range_3_35_26-3_36_39_QDfi
downloadManyHighlightsAPI({
    url: "https://www.youtube.com/watch?v=yJyf8VMj5HE",
    highlights: [
        {start: "0", end: "34"},
        // {start: "1:05:32", end: "1:05:47"},
    ],
    concat: false
}).then(response => {
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