import { downloadYoutubeVideo } from "../../services/downloads/platforms/download-youtube-video"

downloadYoutubeVideo("https://www.youtube.com/watch?v=vUy8uGIB03Qa", "1:23:10", "1:23:30").then(response => {
    console.log("Download Completed")
    console.log(response)
}).catch((err) => {
    console.log("Error")
    console.log(err)
})
// downloadYoutubeVideo("https://www.youtube.com/live/vUy8uGIB03Q", "1:23:10", "1:23:30").then(response => {
//     console.log("Download Completed")
//     console.log(response.toJSON())
// })
// downloadYoutubeVideo("https://www.youtube.com/watch?v=vUy8uGIB03Q", "1:23:10", "1:23:30").then(response => {
//     console.log("Download Completed")
//     console.log(response.toJSON())
// })