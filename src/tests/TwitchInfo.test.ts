import { twitchDownload } from "../services/twitch-download";
import { getTwitchVideoInfo } from "../services/twitch-info";

getTwitchVideoInfo("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
    console.log("-------------------------")
    console.log(video)
    console.log("-------------------------")
})