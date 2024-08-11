import { downloadVideoAPI } from "../../apis/DownloadVideo.api";

downloadVideoAPI("https://www.youtube.com/watch?v=cBnri6QyAew").then(response => {
    console.log("Download Completed")
    console.log(response)
})
downloadVideoAPI("https://www.twitch.tv/chainhucker/clip/ColdShinyHumanPastaThat-B8t4YmsYCqrR9aZE").then(response => {
    console.log("Download Completed")
    console.log(response)
})