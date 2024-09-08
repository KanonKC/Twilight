import { downloadAndUploadVideoAPI, DownloadAndUploadVideoRequest } from "../src/apis/DownloadAndUploadVideo.api";

const payload: DownloadAndUploadVideoRequest = {
    sources: [],
    concat: false,
}

downloadAndUploadVideoAPI(payload).then((response) => {
    console.log(response);
});