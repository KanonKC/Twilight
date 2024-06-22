import { exec } from "child_process";
import { generateRandomString } from "../utilities/String";
import { DownloadVideoModel } from "../models/models";
import { DownloadVideoAttribute } from "../models/types";
import { Model } from "sequelize";

export async function videoConcat(filenames:string[]):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
    
    const generateString = generateRandomString(8)
    const videoId = `concat_${generateString}`
    const outputFilename = `${videoId}.mp4`;
    const inputFiles = filenames.map(filename => `src/dumps/${filename}`).join(" ");
    
    return new Promise((resolve, reject) => {
		exec(
			`sh src/modules/video-concat.sh src/dumps/${outputFilename} ${inputFiles}`,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
					const result = await DownloadVideoModel.create({
						id: videoId,
						title: "empty",
						filename: outputFilename,
						platform: "Stream-Editor",
						platformId: generateString,
					});

					resolve(result)
				}
			}
		);
	});
}