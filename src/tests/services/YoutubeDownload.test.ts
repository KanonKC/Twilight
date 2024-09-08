import { downloadYoutubeVideo } from "../../services/downloads/platforms/download-youtube-video"


downloadYoutubeVideo("https://www.youtube.com/watch?v=fcIzdpWy4T8","2:21","2:42").then((video) => {
    console.log("Download completed, trimming video ...")
    console.log(video)
    // videoTrim(video, 5, 7).then((result) => {
    //     console.log("Done")
    //     console.log(result)
    // })
})