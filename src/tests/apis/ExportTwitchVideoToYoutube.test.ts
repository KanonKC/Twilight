import { exportTwitchVideoToYoutube } from "../../apis/ExportTwitchVideoToYoutube.api";

exportTwitchVideoToYoutube({url: "https://www.twitch.tv/videos/2173667696"}).then((response) => {
    console.log(response)
})