import { ConcatenatedVideo } from '@prisma/client';
import FFmpeg from '../../externals/ffmpeg/ffmpeg';
import ConcatenatedVideoRepository from '../../repositories/concatenated/concatenated.repository';
import DownloadedVideoRepository from '../../repositories/download/download.repository';
import { CreateConcatenatedVideo } from '../../repositories/concatenated/response';

export abstract class IConcatenatedService {
    abstract concatVideos(filenames: string[], title: string | undefined): Promise<ConcatenatedVideo>;
}

export default class ConcatenatedService implements IConcatenatedService {
    private ffmpeg: FFmpeg;
    private concatRepo: ConcatenatedVideoRepository;
    private downloadRepo: DownloadedVideoRepository;

    constructor(ffmpeg: FFmpeg, concatRepo: ConcatenatedVideoRepository, downloadRepo: DownloadedVideoRepository) {
        this.ffmpeg = ffmpeg;
        this.concatRepo = concatRepo;
        this.downloadRepo = downloadRepo;
    }

    async concatVideos(filenames: string[], title: string | undefined): Promise<ConcatenatedVideo> {
        
        const contributedVideo = await this.downloadRepo.getByFilenames(filenames);
        const filename = await this.ffmpeg.concatVideo(filenames, title);

        const r: CreateConcatenatedVideo = {
            title: title ?? filename,
            filename: filename,
            videoIds: contributedVideo.map((video) => video.id),
        }

        const result = await this.concatRepo.create(r);

        return result;
    }
}
