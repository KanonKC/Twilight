import { exec } from "child_process";
import { DownloadVideoModel } from "../../../models/models";
import { DownloadVideoAttribute } from "../../../models/types";
import { Model } from "sequelize";

export async function youtubeDownload(url:string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/youtube-download.py ${url}`,
			async (error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {

					const result = await DownloadVideoModel.create({
						id: stdout.split("[video_unique_id]")[1],
						title: stdout.split("[video_title]")[1],
						filename: stdout.split("[filename]")[1],
						platform: "Youtube",
						platformId: stdout.split("[platform_id]")[1],
					});

					console.log(result.dataValues)

					resolve(result)
				}
				else {
                    throw new Error(stderr);
					// reject()
				}
			}
		);
	});
}