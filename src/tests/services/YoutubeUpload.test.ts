import { youtubeUpload } from "../../services/youtube-upload";

youtubeUpload("src/dumps/twitch_2165090720_range_0_43_31-1_00_40_XeqC.mp4",{
    title: "Test Upload 12345",
}).then(response => {
    console.log("Upload Completed")
    console.log(response)
})