import { twitchDownload } from "../services/twitch-download";
import { videoTrim } from "../services/video-trim";

twitchDownload("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
    videoTrim(video,6,8).then((result) => {
        console.log("-------------------------")
        console.log(result)
        console.log("-------------------------")
    })
})