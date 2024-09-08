import { ConcatenatedVideo } from "@prisma/client";
import { exec } from "child_process";
import { prisma } from "../../prisma";
import { generateRandomString } from "../../utilities/String";
import { configDotenv } from "dotenv";

configDotenv();
const { VIDEO_STORAGE_PATH } = process.env;

export async function getVideoDuration(filename:string):Promise<number> {
    
    return new Promise((resolve, reject) => {
		exec(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${VIDEO_STORAGE_PATH}/${filename}`,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
                    const duration = parseFloat(stdout)
					resolve(duration)
				}
			}
		);
	});
}