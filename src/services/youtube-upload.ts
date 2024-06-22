import { exec } from "child_process";
import { DownloadVideoModel } from "../models/models";
import { DownloadVideoAttribute } from "../models/types";
import { Model } from "sequelize";

export interface YoutubeUploadVideoDetail {
    title: string;
    description?: string;
    tags?: string[];
    privacyStatus?: "public" | "private" | "unlisted";
}

export interface YoutubeUploadVideoResponse {
	videoId: string;
}

export async function youtubeUpload(
    filePath:string,
    {
        title,
        description="",
        tags=[],
        privacyStatus="unlisted",
    }: YoutubeUploadVideoDetail
): Promise<YoutubeUploadVideoResponse> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/youtube-upload.py --file="${filePath}" --title="${title}" --description="${description}" --keywords="${tags.join(",")}" --category="22" --privacyStatus="${privacyStatus}"`,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
					resolve({videoId: stdout.split("'")[1]})
				}
			}
		);
	});
}