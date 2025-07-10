import { exec } from "child_process";
import { YoutubeUploadVideoDetail } from "../../types/Youtube.type";

export default class Python {
	constructor() {}

	async youtubeUpload(
		filePath: string,
		{
			title,
			description = "",
			tags = [],
			privacyStatus = "unlisted",
		}: YoutubeUploadVideoDetail
	): Promise<{
		videoId: string;
	}> {
		return new Promise((resolve, reject) => {
			exec(
				`python src/libs/youtube-upload.py --file="${filePath}" --title="${title}" --description="${description}" --keywords="${tags.join(
					","
				)}" --category="22" --privacyStatus="${privacyStatus}"`,
				async (error, stdout, _) => {
					if (error) {
						reject(error);
					} else {
						resolve({ videoId: stdout.split("'")[1] });
					}
				}
			);
		});
	}
}
