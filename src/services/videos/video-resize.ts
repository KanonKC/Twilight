import { ConcatenatedVideo } from "@prisma/client";
import { exec } from "child_process";
import { prisma } from "../../prisma";
import { generateRandomString } from "../../utilities/String";
import { configDotenv } from "dotenv";

configDotenv();

export async function videoResize(filename:string, width: number, height: number): Promise<{
    filename: string,
}> {
    
    const generateString = generateRandomString(8)
    const videoId = `${filename}_resize_${generateString}`
    const outputFilename = `${videoId}.mp4`;
    
    return new Promise((resolve, reject) => {
		exec(
			`ffmpeg -i ${process.env.VIDEO_STORAGE_PATH}/${filename} -s ${width}x${height} -c:a copy ${process.env.VIDEO_STORAGE_PATH}/${outputFilename}`,
			async (error) => {
				if (error) {
					reject(error)
				}
				else {
					resolve({
                        filename: outputFilename,
                    })
				}
			}
		);
	});
}