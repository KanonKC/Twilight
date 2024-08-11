import { DownloadedVideo } from "@prisma/client";
import { exec } from "child_process";
import { Model } from "sequelize";
import { prisma } from "../../../prisma";

export async function youtubeDownload(url:string):Promise<DownloadedVideo> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/youtube-download.py ${url}`,
			async (error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {

					const result = await prisma.downloadedVideo.create({
						data: {
							title: stdout.split("[video_title]")[1],
							filename: stdout.split("[filename]")[1],
							platform: "Youtube",
							platformId: stdout.split("[platform_id]")[1],
						}
					});

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