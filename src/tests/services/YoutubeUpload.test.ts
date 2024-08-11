import { configDotenv } from "dotenv"
import { youtubeUpload } from "../../services/uploads/youtube-upload"

configDotenv();

youtubeUpload(`${process.env.VIDEO_STORAGE_PATH}/twitch_2174338772_range_0_45_28-1_00_52_3GE4.mp4`,{
    title: "Test Upload 12345",
}).then(response => {
    console.log("Upload Completed")
    console.log(response)
})