import { youtubeUpload } from "../../services/youtube-upload";

youtubeUpload("src/dumps/youtube_KNqZv5q7Rj4_range_1_04_04-1_04_34_E6gT.mp4",{
    title: "Test Upload 12345",
}).then(response => {
    console.log("Upload Completed")
    console.log(response)
})