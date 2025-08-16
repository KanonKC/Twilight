import config from "../src/configs";
import DownloadAndUploadVideoScript, {
	DownloadAndUploadVideoRequest,
} from "../src/scripts/download-and-upload-video";

const payload: DownloadAndUploadVideoRequest = {
	sources: [
		{
			url: "https://www.youtube.com/live/c-ACj2UYIbI",
            highlights: [
                {
                    start: "6:48",
                    end: "7:39"
                }
            ]
		},
	],
	youtube: {
		title: "ถ้าจะตายเก็บ Rune ให้ด้วย",
		privacyStatus: "unlisted"
	}
};
const duv = new DownloadAndUploadVideoScript(config);
duv.do(payload).then(console.log);
