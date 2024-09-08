import { downloadAndUploadVideoAPI } from "../../apis/DownloadAndUploadVideo.api";

downloadAndUploadVideoAPI({
    sources: []
}).then((response) => {
    console.log(response)
})