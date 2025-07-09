import { DownloadedVideo } from "@prisma/client";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import { Config } from "../../configs";
import { prisma } from "../../prisma";

export default class ConcatenatedService {
	
    private ffmpeg: FFmpeg;
    
    constructor(config: Config) {
        this.ffmpeg = new FFmpeg(config);
    }

	async concatVideos(filenames: string[], title: string | undefined) {
        const contributedVideo = await prisma.downloadedVideo.findMany({
			where: {
				filename: {
					in: filenames,
				},
			},
		});

        const filename = await this.ffmpeg.concatVideo(filenames, title);
    
        const result = await prisma.concatenatedVideo.create({
            data: {
                title:
                    title ?? filename,
                filename: filename,
                downloadedVideos: {
                    createMany: {
                        data: contributedVideo.map((video) => ({
                            downloadedVideoId: video.id,
                        })),
                    },
                },
            },
        });

        return result;
    }
}
