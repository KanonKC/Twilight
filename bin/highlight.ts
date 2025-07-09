import {
	downloadAndUploadVideoAPI,
	DownloadAndUploadVideoRequest,
} from "../src/apis/DownloadAndUploadVideo.api";

function main() {
	const [,,url] = process.argv;

	if (!url) {
		console.log(`Usage: highlight <url>`);
		return;
	}

	const payload: DownloadAndUploadVideoRequest = {
		sources: [
			{
				url: url,
				autoHighlights: true,
			},
		],
		concat: true,
	};

	downloadAndUploadVideoAPI(payload).then((response) => {
		console.log(response);
	});
}

main()