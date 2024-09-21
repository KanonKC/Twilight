import { ConcatenatedVideo } from "@prisma/client";
import { exec } from "child_process";
import { prisma } from "../../prisma";
import { generateRandomString } from "../../utilities/String";
import { configDotenv } from "dotenv";

configDotenv();
const { VIDEO_STORAGE_PATH } = process.env;

export async function getVideoResolution(filename:string): Promise<{
    width: number,
    height: number,
}> {
    
    return new Promise((resolve, reject) => {
		exec(
			`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${VIDEO_STORAGE_PATH}/${filename}`,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
                    const [width, height] = stdout.split('x').map((value) => parseInt(value))
                    resolve({ width, height })
				}
			}
		);
	});
}