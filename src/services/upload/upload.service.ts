import Python from "../../externals/python/python";
import { YoutubeUploadVideoDetail } from "../../types/Youtube.type";

export abstract class IUploadService {
    abstract uploadYoutubeVideo(filePath: string, options: YoutubeUploadVideoDetail): Promise<{ videoId: string }>;
}

export default class UploadService implements IUploadService {
	private python: Python;
	constructor(python: Python) {
		this.python = python;
	}

	async uploadYoutubeVideo(
		filePath: string,
		{
			title,
			description = '',
			tags = [],
			privacyStatus = 'unlisted',
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
