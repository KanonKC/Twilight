import { exec } from "child_process";
import { Model } from "sequelize";
import { generateRandomString } from "../../../utilities/String";
import { getYoutubeVideoKey } from "../../../utilities/Url";
import { configDotenv } from "dotenv";
import { DownloadedVideo } from "@prisma/client";
import { prisma } from "../../../prisma";
import { getYoutubeVideoData } from "./get-youtube-video-data";
import { getVideoDuration } from "../../videos/get-video-duration";
import { convertHHMMSSStringToSeconds } from "../../../utilities/Time";
import { DownloadVideoOptions } from "../../../types/DownloadVideo.type";
import { getVideoResolution } from "../../videos/get-video-resolution";
import { videoResize } from "../../videos/video-resize";

configDotenv();



export async function downloadYoutubeVideo(url:string, options?: DownloadVideoOptions):Promise<DownloadedVideo> {
	const videoKey = getYoutubeVideoKey(url);

	let filename:string;
	let command:string;
    let timeRange = {}

    let start:string | undefined;
    let end:string | undefined;
    let width:number | undefined;
    let height:number | undefined;

    if (options) {
        if (options.range) {
            start = options.range.start
            end = options.range.end
        }
        if (options.resolution) {
            width = options.resolution.width
            height = options.resolution.height
        }
    }

	const videoInfo = await getYoutubeVideoData(url);
    // const baseCommand = `yt-dlp --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
    // const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
    const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" --merge-output-format mp4`
	
	if (start && end) {
		const startText = start.split(':').join("_");
		const endText = end.split(':').join("_");
		filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(4)}.mp4`;
		command = `${baseCommand} --download-sections "*${start}-${end}" "${videoKey}" -o "${filename}"`
        timeRange = {startTime: convertHHMMSSStringToSeconds(start), endTime: convertHHMMSSStringToSeconds(end)}
    }
	else {
		filename = `youtube_${videoKey}_${generateRandomString(4)}.mp4`;
		command = `${baseCommand} "${videoKey}" -o "${filename}"`
	}

    if (true) {
        // TODO: Handle IPv4 options flag
        command = `${command} -4`
    }

    console.log(command)

    async function tryDownloadYoutubeVideo(url:string, options?: DownloadVideoOptions): Promise<DownloadedVideo> {
        return new Promise((resolve, reject) => {
            exec(
                command,
                async (error) => {
                    if (error) {
                        reject(error)
                    }
                    else {
    
                        const duration = await getVideoDuration(filename)
    
                        const resolution = await getVideoResolution(filename)
                        
                        let profileWidth = resolution.width;
                        let profileHeight = resolution.height;
    
                        if (width && height) {
                            if (resolution.width !== width || resolution.height !== height) {
                                const resizedFilename = await videoResize(filename, width, height)
                                profileWidth = width;
                                profileHeight = height;
                                filename = resizedFilename.filename
                            }
                        }
    
                        const result = await prisma.downloadedVideo.create({
                            data: {
                                title: videoInfo.title,
                                filename: filename,
                                url: url,
                                duration: duration,
                                platform: "Youtube",
                                platformId: videoKey,
                                width: profileWidth,
                                height: profileHeight,
                                ...timeRange
                            }
                        });
    
                        resolve(result)
                    }
                }
            );
        });
    }

	let count = 0

    while (count <= 100) {
        try {
            const result = await tryDownloadYoutubeVideo(url, options)
            return result
        }
        catch (error) {
            count++
            console.log(`Failed to download youtube video ${url}, retrying... (${count}/100)`, error)
            setTimeout(() => {}, 10* 1000)
        }
    }

    throw new Error("Failed to download youtube video command: " + command)
}