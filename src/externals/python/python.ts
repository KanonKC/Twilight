import { exec } from "child_process";
import { YoutubeUploadVideoDetail } from "../../types/Youtube.type";

export default class Python {
	constructor() {}

	async initYoutubeAuth() {
		return new Promise((resolve, reject) => {
			exec(`python src/libs/youtube-auth.py`, async (error) => {
				if (error) {
					reject({ success: false, error });
				} else {
					resolve({ success: true });
				}
			});
		});
	}

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

	async getAudioSpike(
		filename: string,
		options?: {
			threshold?: number;
		}
	): Promise<number[]> {
		const defaultThreshold = 0.6;
		const command = `python src/libs/audio-spike.py ${filename} ${
			options?.threshold ?? defaultThreshold
		}`;
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, _) => {
				if (error) {
					reject(error);
				}
				const result = JSON.parse(stdout);
				resolve(result);
			});
		});
	}
}
