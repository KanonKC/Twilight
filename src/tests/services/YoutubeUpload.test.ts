import { youtubeUpload } from "../../services/youtube-upload";

youtubeUpload("src/dumps/twitch_2174338772_range_0_45_28-1_00_52_3GE4.mp4",{
    title: "Test Upload 12345",
}).then(response => {
    console.log("Upload Completed")
    console.log(response)
})