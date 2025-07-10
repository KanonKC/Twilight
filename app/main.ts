import { downloadAndUploadVideoAPI, DownloadAndUploadVideoRequest } from "../src/apis/DownloadAndUploadVideo.api";

const payload: DownloadAndUploadVideoRequest = {
    sources: [
        {
            url: "https://www.youtube.com/live/vX2t5c8LVUA",
            // autoHighlights: true,
            highlights: [
                {
                    start: "01:21:20",
                    end: "01:21:30",
                }, 
                // {
                //     start: "00:18:03",
                //     end: "00:18:15",
                // }, 
                // {
                //     start: "02:46:02",
                //     end: "02:46:08",
                // }, 
                // {
                //     start: "02:46:02",
                //     end: "02:46:08",
                // }, 
            ],
        },

    ],
    // concat: true,
    // youtube: {
    //     title: "Visage Moment",
    //     description: "Very new upload",
    //     privacyStatus: "private",
    // }
}

downloadAndUploadVideoAPI(payload).then(console.log);