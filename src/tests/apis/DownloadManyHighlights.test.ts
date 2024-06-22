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
    url: "https://www.youtube.com/live/dsGz1s_7QX0",
    highlights: [
        {start: "1:28:40", end: "1:28:46"},
        {start: "1:39:09", end: "1:39:24"},
        {start: "2:09:43", end: "2:09:50"},
        {start: "2:10:08", end: "2:10:24"},
        {start: "2:12:25", end: "2:12:38"},
        {start: "2:17:24", end: "2:17:36"},
        {start: "2:26:43", end: "2:27:07"},
        {start: "2:43:17", end: "2:43:44"},
        // {start: "1:05:32", end: "1:05:47"},
    ],
    concat: true
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