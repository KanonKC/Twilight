import { ConcatenatedVideo, PrismaClient } from "@prisma/client";
import { CreateConcatenatedVideo } from "./response";

export abstract class IConcatenatedVideoRepository {
    abstract create(r: CreateConcatenatedVideo): Promise<ConcatenatedVideo>;
}

export default class ConcatenatedVideoRepository implements IConcatenatedVideoRepository {
    
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    create(r: CreateConcatenatedVideo): Promise<ConcatenatedVideo> {
        return this.prisma.concatenatedVideo.create({
            data: {
                title:
                    r.title ?? r.filename,
                filename: r.filename,
                downloadedVideos: {
                    createMany: {
                        data: r.videoIds.map((id) => ({
                            downloadedVideoId: id,
                        })),
                    },
                },
            },
        });
    }
}