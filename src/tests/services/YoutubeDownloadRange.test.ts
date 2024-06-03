import { youtubeDownloadRange } from "../../services/youtube-download-range";

youtubeDownloadRange("https://www.youtube.com/watch?v=vUy8uGIB03Qa", "1:23:10", "1:23:30").then(response => {
    console.log("Download Completed")
    console.log(response.toJSON())
}).catch((err) => {
    console.log("Error")
    console.log(err)
})
// youtubeDownloadRange("https://www.youtube.com/live/vUy8uGIB03Q", "1:23:10", "1:23:30").then(response => {
//     console.log("Download Completed")
//     console.log(response.toJSON())
// })
// youtubeDownloadRange("https://www.youtube.com/watch?v=vUy8uGIB03Q", "1:23:10", "1:23:30").then(response => {
//     console.log("Download Completed")
//     console.log(response.toJSON())
// })