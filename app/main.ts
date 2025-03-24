import { downloadAndUploadVideoAPI, DownloadAndUploadVideoRequest } from "../src/apis/DownloadAndUploadVideo.api";

const payload: DownloadAndUploadVideoRequest = {
    sources: [
        {
            url: "https://www.youtube.com/watch?v=59YRutbHJ0Q",
            highlights: [
                {
                    start: "1:33:30",
                    end: "1:35:10"
                }
            ]
        }
    ],
    concat: false,
}

downloadAndUploadVideoAPI(payload).then((response) => {
    console.log(response);
});