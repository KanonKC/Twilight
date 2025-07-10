import { DownloadedVideo } from "@prisma/client";
import { exec } from "child_process";
import { Config } from "../../configs";
import { VideoTrimResult } from "../../types/DownloadVideo.type";
import { generateRandomString } from "../../utilities/String";
import { convertHHMMSSStringToSeconds, convertSecondsToHHMMSSString } from "../../utilities/Time";

export default class FFmpeg {
	private config: Config;

	constructor(config: Config) {
		this.config = config;
	}

	async getVideoDuration(filename: string): Promise<number> {
		return new Promise((resolve, reject) => {
			exec(
				`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${this.config.VideoStoragePath}/${filename}`,
				async (error, stdout, stderr) => {
					if (error) {
						reject(error);
						return;
					}

					if (stderr) {
						reject(stderr);
						return;
					}

					try {
						const duration = parseFloat(stdout);
						resolve(duration);
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

	async getScreenDetection(filename: string): Promise<number[]> {
		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${filename} -filter:v "select='gt(scene,0.3)',showinfo" -f null -`,
				(error, stdout, stderr) => {
					try {
						if (error) {
							reject(error);
							return;
						}
						if (stderr) {
							reject(stderr);
							return;
						}
						const result = JSON.parse(stdout);
						resolve(result);
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

	async getVideoResolution(filename: string): Promise<{
		width: number;
		height: number;
	}> {
		return new Promise((resolve, reject) => {
			exec(
				`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${this.config.VideoStoragePath}/${filename}`,
				async (error, stdout, stderr) => {
					if (error) {
						reject(error);
						return;
					}
					if (stderr) {
						reject(stderr);
						return;
					}

					try {
						const [width, height] = stdout
							.split("x")
							.map((value) => parseInt(value));
						resolve({ width, height });
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

	async concatVideo(
		filenames: string[],
		title: string | undefined
	): Promise<string> {
		const generateString = generateRandomString(8);
		const videoId = `concat_${generateString}`;
		const outputFilename = `${videoId}.mp4`;
		const inputFiles = filenames
			.map((filename) => `${this.config.VideoStoragePath}/${filename}`)
			.join(" ");


		return new Promise((resolve, reject) => {
			exec(
				`sh src/modules/video-concat.sh ${this.config.VideoStoragePath}/${outputFilename} ${inputFiles}`,
				async (error, _, stderr) => {
					if (error) {
						reject(error);
						return;
					}
					if (stderr) {
						reject(stderr);
						return;
					}

					try {
						resolve(outputFilename);
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

	async resizeVideo(
		filename: string,
		width: number,
		height: number
	): Promise<{
		filename: string;
	}> {
		const generateString = generateRandomString(8);
		const videoId = `${filename.split(".")[0]}_resize_${generateString}`;
		const outputFilename = `${videoId}.mp4`;

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${this.config.VideoStoragePath}/${filename} -s ${width}x${height} -c:a copy ${this.config.VideoStoragePath}/${outputFilename}`,
				async (error) => {
					if (error) {
						reject(error);
						return;
					}

					try {
						resolve({
							filename: outputFilename,
						});
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

    async trimVideo(
        video: DownloadedVideo,
        start: string | number,
        end: string | number
    ): Promise<VideoTrimResult> {
        let startTime = "00:00:00";
        let endTime = "00:00:00";
    
        if (typeof start === "string") {
            startTime = start;
        } else {
            startTime = convertSecondsToHHMMSSString(start);
        }
    
        if (typeof end === "string") {
            endTime = end;
        } else {
            endTime = convertSecondsToHHMMSSString(end);
        }
    
        const randomString = generateRandomString(6);
        const outputFilename = `trimmed_${video.platformId}_${randomString}.mp4`;
    
        return new Promise((resolve, reject) => {
            exec(
                `ffmpeg -ss ${startTime} -to ${endTime} -i ${this.config.VideoStoragePath}/${video.filename} -c copy ${this.config.VideoStoragePath}/${outputFilename}`,
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    try {
                    resolve({
                        originalVideo: video,
                        editedVideo: {
                            ...video,
                            filename: outputFilename,
                        },
                        start: convertHHMMSSStringToSeconds(startTime),
                            end: convertHHMMSSStringToSeconds(endTime),
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }
}
