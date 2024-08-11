import { ConcatenatedVideo } from "@prisma/client";
import { exec } from "child_process";
import { prisma } from "../../prisma";
import { generateRandomString } from "../../utilities/String";
import { configDotenv } from "dotenv";

configDotenv();

export async function videoConcat(filenames:string[],title:string|undefined):Promise<ConcatenatedVideo> {
    
    const generateString = generateRandomString(8)
    const videoId = `concat_${generateString}`
    const outputFilename = `${videoId}.mp4`;
    const inputFiles = filenames.map(filename => `${process.env.VIDEO_STORAGE_PATH}/${filename}`).join(" ");

	const contributedVideo = await prisma.downloadedVideo.findMany({
		where: {
			filename: {
				in: filenames
			}
		}
	})
    
    return new Promise((resolve, reject) => {
		exec(
			`sh src/modules/video-concat.sh ${process.env.VIDEO_STORAGE_PATH}/${outputFilename} ${inputFiles}`,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
					const result = await prisma.concatenatedVideo.create({
						data: {
							title: "concat-video-test",
							filename: outputFilename,
							downloadedVideos: {
								createMany: {
									data: contributedVideo.map(video => ({
										downloadedVideoId: video.id,
									}))
								}
							}
						}
					});
					resolve(result)
				}
			}
		);
	});
}