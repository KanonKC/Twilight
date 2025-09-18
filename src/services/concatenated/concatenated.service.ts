import { ConcatenatedVideo } from "@prisma/client";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import { prisma } from "../../prisma";

export abstract class IConcatenatedService {
    abstract concatVideos(filenames: string[], title: string | undefined): Promise<ConcatenatedVideo>;
}

export default class ConcatenatedService implements IConcatenatedService {
	
    private ffmpeg: FFmpeg;
    
    constructor(ffmpeg: FFmpeg) {
        this.ffmpeg = ffmpeg;
    }

	async concatVideos(filenames: string[], title: string | undefined): Promise<ConcatenatedVideo> {
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
