import { exec } from "child_process";
import { Model } from "sequelize";
import { generateRandomString } from "../../utilities/String";
import { prisma } from "../..";
import { ConcatenatedVideo } from "@prisma/client";

export async function videoConcat(filenames:string[],title:string|undefined):Promise<ConcatenatedVideo> {
    
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
					const result = await prisma.concatenatedVideo.create({
						data: {
							title: "empty",
							filename: outputFilename,
						}
					});
					resolve(result)
				}
			}
		);
	});
}