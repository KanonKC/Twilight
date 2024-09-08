import { getTwitchVideoData } from "../../services/downloads/platforms/get-twitch-video-data"

getTwitchVideoData("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
    console.log("-------------------------")
    console.log(video)
    console.log("-------------------------")
})