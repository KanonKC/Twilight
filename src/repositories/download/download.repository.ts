import { DownloadedVideo, PrismaClient } from '@prisma/client';
import { CreateDownloadedVideo } from './response';

export abstract class IDownloadedVideoRepository {
    abstract create(r: CreateDownloadedVideo): Promise<DownloadedVideo>;
    abstract getByFilename(filename: string): Promise<DownloadedVideo | null>;
    abstract getByFilenames(filenames: string[]): Promise<DownloadedVideo[]>;
    abstract getByPlatform(platform: string, platformId: string): Promise<DownloadedVideo | null>;
}

export default class DownloadedVideoRepository implements IDownloadedVideoRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    create(r: CreateDownloadedVideo): Promise<DownloadedVideo> {
        return this.prisma.downloadedVideo.create({
            data: {
                title: r.title,
                filename: r.filename,
                url: r.url,
                duration: r.duration,
                platform: r.platform,
                platformId: r.platformId,
                width: r.width,
                height: r.height,
                startTime: r.startTime,
                endTime: r.endTime,
            },
        });
    }

    getByFilename(filename: string): Promise<DownloadedVideo | null> {
        return this.prisma.downloadedVideo.findFirst({
            where: {
                filename: filename,
            },
        });
    }

    getByFilenames(filenames: string[]): Promise<DownloadedVideo[]> {
        return this.prisma.downloadedVideo.findMany({
            where: {
                filename: {
                    in: filenames,
                },
            },
        });
    }

    getByPlatform(platform: string, platformId: string): Promise<DownloadedVideo | null> {
        return this.prisma.downloadedVideo.findFirst({
            where: {
                platform: platform,
                platformId: platformId,
            },
        });
    }
}
