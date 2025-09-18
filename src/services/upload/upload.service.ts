import Python from "../../externals/python/python";
import { YoutubeUploadVideoDetail } from "../../types/Youtube.type";

export default class UploadService {
	private python: Python;
	constructor(python: Python) {
		this.python = python;
	}

	async uploadYoutubeVideo(
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
		return this.python.youtubeUpload(filePath, {
			title,
			description,
			tags,
			privacyStatus,
		});
	}
}
