// twitch-dl download https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3 -q source

import { exec } from "child_process";
// import { getTwitchVideoData } from "./get-twitch-video-data";
import { DownloadedVideo } from "@prisma/client";
import { configDotenv } from "dotenv";
import { prisma } from "../../../prisma";
import { generateRandomString } from "../../../utilities/String";
import { getVideoDuration } from "../../videos/get-video-duration";
import { convertHHMMSSStringToSeconds } from "../../../utilities/Time";
import { DownloadVideoOptions } from "../../../types/DownloadVideo.type";
import { getVideoResolution } from "../../videos/get-video-resolution";
import { videoResize } from "../../videos/video-resize";

configDotenv();

export async function downloadTwitchVideo(url:string, options?: DownloadVideoOptions):Promise<DownloadedVideo> {

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

    // Don't forget to fix this
    const videoInfo = {
        id: generateRandomString(10),
        title: undefined
    }
    
    let videoId:string;
    let filename:string;
	let command:string;
    let timeRange = {} 
    
    if (start && end) {
        const startText = start.split(':').join("_");
        const endText = end.split(':').join("_");
        videoId = `twitch_${videoInfo.id}_range_${startText}-${endText}_${generateRandomString(4)}`;
        filename = `${videoId}.mp4`;
        command = `twitch-dl download ${url} -q source --start ${start} --end ${end} --overwrite -o ${process.env.VIDEO_STORAGE_PATH}/${filename}`
        timeRange = {startTime: convertHHMMSSStringToSeconds(start), endTime: convertHHMMSSStringToSeconds(end)}
    }
    else {
        videoId = `twitch_${videoInfo.id}_${generateRandomString(4)}`;
        filename = `${videoId}.mp4`;
        command = `twitch-dl download ${url} -q source --overwrite -o ${process.env.VIDEO_STORAGE_PATH}/${filename}`
    }
    
    return new Promise((resolve, reject) => {
        exec(
			command,
			async (error) => {
				if (error) {
                    throw new Error(error.message)
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
                            platform: "Twitch",
                            platformId: videoInfo.id,
                            width: profileWidth,
                            height: profileHeight,
                            ...timeRange
                        }
                    })

					resolve(result)
				}

			}
		);
	});
}