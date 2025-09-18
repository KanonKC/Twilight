import { DownloadedVideo } from '@prisma/client';
import DownloadService from './download.service';
import FFmpeg from '../../externals/ffmpeg/ffmpeg';
import TwitchDl from '../../externals/twitch-dl/twitch-dl';
import YtDlp from '../../externals/yt-dlp/yt-dlp';
import DownloadedVideoRepository from '../../repositories/download/download.repository';
import { Config } from '../../configs';
import { DownloadVideoOptions, ExtendedDownloadedVideo, TwitchVideo } from '../../types/DownloadVideo.type';
import { VideoProfile } from './response';
import { DownloadTwitchVideo } from '../../externals/twitch-dl/response';
import { DownloadYoutubeVideo } from '../../externals/yt-dlp/response';
import * as fs from 'fs';

// Mock the dependencies
jest.mock('../../externals/ffmpeg/ffmpeg');
jest.mock('../../externals/twitch-dl/twitch-dl');
jest.mock('../../externals/yt-dlp/yt-dlp');
jest.mock('../../repositories/download/download.repository');
jest.mock('fs');

describe('DownloadService', () => {
    let service: DownloadService;
    let mockFFmpeg: jest.Mocked<FFmpeg>;
    let mockTwitchDl: jest.Mocked<TwitchDl>;
    let mockYtDlp: jest.Mocked<YtDlp>;
    let mockDownloadRepo: jest.Mocked<DownloadedVideoRepository>;
    let mockConfig: Config;
    let mockFs: jest.Mocked<typeof fs>;

    // Mock data
    const mockVideoProfile: VideoProfile = {
        filename: 'test-video.mp4',
        width: 1920,
        height: 1080,
        duration: 120,
    };

    const mockDownloadedVideo: DownloadedVideo = {
        id: 1,
        title: 'Test Video',
        filename: 'test-video.mp4',
        url: 'https://example.com/video',
        duration: 120,
        platform: 'Youtube',
        platformId: 'abc123',
        width: 1920,
        height: 1080,
        startTime: null,
        endTime: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    };

    const mockTwitchVideoData: TwitchVideo = {
        id: 'twitch123',
        slug: 'test-slug',
        title: 'Test Twitch Video',
        createdAt: '2023-01-01T00:00:00Z',
        viewCount: 1000,
        durationSeconds: 120,
        url: 'https://clips.twitch.tv/test',
        videoQualities: [],
        game: { id: 'game1', name: 'Test Game' },
        broadcaster: { displayName: 'TestUser', login: 'testuser' },
    };

    const mockTwitchDownload: DownloadTwitchVideo = {
        id: 'twitch123',
        title: 'Test Twitch Video',
        filename: 'twitch_video.mp4',
    };

    const mockYoutubeDownload: DownloadYoutubeVideo = {
        id: 'youtube123',
        title: 'Test YouTube Video',
        filename: 'youtube_video.mp4',
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks
        mockFFmpeg = new FFmpeg({} as any) as jest.Mocked<FFmpeg>;
        mockTwitchDl = new TwitchDl() as jest.Mocked<TwitchDl>;
        mockYtDlp = new YtDlp() as jest.Mocked<YtDlp>;
        mockDownloadRepo = new DownloadedVideoRepository({} as any) as jest.Mocked<DownloadedVideoRepository>;
        mockFs = fs as jest.Mocked<typeof fs>;
        
        mockConfig = {
            VideoStoragePath: '/test/videos',
            Port: 3000,
            TwitchClientId: 'test-client-id',
        };

        // Setup environment variable
        process.env.VIDEO_STORAGE_PATH = '/test/videos';

        service = new DownloadService(mockTwitchDl, mockFFmpeg, mockYtDlp, mockConfig, mockDownloadRepo);
    });

    describe('generateVideoProfile', () => {
        const testFilename = 'test-video.mp4';

        beforeEach(() => {
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
        });

        it('should generate video profile without resolution options', async () => {
            const result = await service.generateVideoProfile(testFilename);

            expect(mockFFmpeg.getVideoDuration).toHaveBeenCalledWith(testFilename);
            expect(mockFFmpeg.getVideoResolution).toHaveBeenCalledWith(testFilename);
            expect(result).toEqual({
                filename: testFilename,
                width: 1920,
                height: 1080,
                duration: 120,
            });
        });

        it('should generate video profile with same resolution (no resize needed)', async () => {
            const options: DownloadVideoOptions = {
                resolution: { width: 1920, height: 1080 },
            };

            const result = await service.generateVideoProfile(testFilename, options);

            expect(mockFFmpeg.resizeVideo).not.toHaveBeenCalled();
            expect(result).toEqual({
                filename: testFilename,
                width: 1920,
                height: 1080,
                duration: 120,
            });
        });

        it('should resize video when different resolution is specified', async () => {
            const options: DownloadVideoOptions = {
                resolution: { width: 1280, height: 720 },
            };
            const resizedFilename = 'test-video_resized.mp4';
            
            mockFFmpeg.resizeVideo.mockResolvedValue({ filename: resizedFilename });

            const result = await service.generateVideoProfile(testFilename, options);

            expect(mockFFmpeg.resizeVideo).toHaveBeenCalledWith(testFilename, 1280, 720);
            expect(result).toEqual({
                filename: resizedFilename,
                width: 1280,
                height: 720,
                duration: 120,
            });
        });

        it('should handle FFmpeg errors', async () => {
            const error = new Error('FFmpeg duration failed');
            mockFFmpeg.getVideoDuration.mockRejectedValue(error);

            await expect(service.generateVideoProfile(testFilename)).rejects.toThrow('FFmpeg duration failed');
        });
    });

    describe('downloadTwitchVideo', () => {
        const testUrl = 'https://clips.twitch.tv/test';

        beforeEach(() => {
            mockTwitchDl.downloadTwitchVideo.mockResolvedValue(mockTwitchDownload);
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);
        });

        it('should download Twitch video without options', async () => {
            const result = await service.downloadTwitchVideo(testUrl);

            expect(mockTwitchDl.downloadTwitchVideo).toHaveBeenCalledWith(testUrl, undefined);
            expect(mockDownloadRepo.create).toHaveBeenCalledWith({
                title: mockTwitchDownload.title,
                filename: mockTwitchDownload.filename,
                url: testUrl,
                duration: 120,
                platform: 'Twitch',
                platformId: mockTwitchDownload.id,
                width: 1920,
                height: 1080,
                startTime: undefined,
                endTime: undefined,
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should download Twitch video with range options', async () => {
            const options: DownloadVideoOptions = {
                range: { start: '00:01:00', end: '00:02:00' },
            };

            const result = await service.downloadTwitchVideo(testUrl, options);

            expect(mockTwitchDl.downloadTwitchVideo).toHaveBeenCalledWith(testUrl, options);
            expect(mockDownloadRepo.create).toHaveBeenCalledWith({
                title: mockTwitchDownload.title,
                filename: mockTwitchDownload.filename,
                url: testUrl,
                duration: 120,
                platform: 'Twitch',
                platformId: mockTwitchDownload.id,
                width: 1920,
                height: 1080,
                startTime: 60, // 1 minute in seconds
                endTime: 120, // 2 minutes in seconds
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should use filename as title when title is undefined', async () => {
            const downloadWithoutTitle = { ...mockTwitchDownload, title: undefined };
            mockTwitchDl.downloadTwitchVideo.mockResolvedValue(downloadWithoutTitle);

            await service.downloadTwitchVideo(testUrl);

            expect(mockDownloadRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: downloadWithoutTitle.filename,
                })
            );
        });
    });

    describe('downloadYoutubeVideo', () => {
        const testUrl = 'https://www.youtube.com/watch?v=abc123';

        beforeEach(() => {
            mockYtDlp.downloadYoutubeVideo.mockResolvedValue(mockYoutubeDownload);
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);
        });

        it('should download YouTube video without options', async () => {
            const result = await service.downloadYoutubeVideo(testUrl);

            expect(mockYtDlp.downloadYoutubeVideo).toHaveBeenCalledWith(testUrl, undefined);
            expect(mockDownloadRepo.create).toHaveBeenCalledWith({
                title: mockYoutubeDownload.title,
                filename: mockYoutubeDownload.filename,
                url: testUrl,
                duration: 120,
                platform: 'Youtube',
                platformId: mockYoutubeDownload.id,
                width: 1920,
                height: 1080,
                startTime: undefined,
                endTime: undefined,
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should download YouTube video with range options', async () => {
            const options: DownloadVideoOptions = {
                range: { start: '00:00:30', end: '00:01:30' },
            };

            const result = await service.downloadYoutubeVideo(testUrl, options);

            expect(mockYtDlp.downloadYoutubeVideo).toHaveBeenCalledWith(testUrl, options);
            expect(mockDownloadRepo.create).toHaveBeenCalledWith({
                title: mockYoutubeDownload.title,
                filename: mockYoutubeDownload.filename,
                url: testUrl,
                duration: 120,
                platform: 'Youtube',
                platformId: mockYoutubeDownload.id,
                width: 1920,
                height: 1080,
                startTime: 30, // 30 seconds
                endTime: 90, // 1 minute 30 seconds
            });
            expect(result).toBe(mockDownloadedVideo);
        });
    });

    describe('getLocalVideo', () => {
        it('should get YouTube video by platform and ID', async () => {
            const url = 'https://www.youtube.com/watch?v=abc123';
            mockDownloadRepo.getByPlatform.mockResolvedValue(mockDownloadedVideo);

            const result = await service.getLocalVideo(url);

            expect(mockDownloadRepo.getByPlatform).toHaveBeenCalledWith('Youtube', 'abc123');
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should get Twitch video by platform and ID', async () => {
            const url = 'https://clips.twitch.tv/test';
            mockTwitchDl.getTwitchVideoData.mockResolvedValue(mockTwitchVideoData);
            mockDownloadRepo.getByPlatform.mockResolvedValue(mockDownloadedVideo);

            const result = await service.getLocalVideo(url);

            expect(mockTwitchDl.getTwitchVideoData).toHaveBeenCalledWith(url);
            expect(mockDownloadRepo.getByPlatform).toHaveBeenCalledWith('Twitch', mockTwitchVideoData.id);
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should get local video by filename', async () => {
            const filename = 'local-video.mp4';
            mockDownloadRepo.getByFilename.mockResolvedValueOnce(mockDownloadedVideo);

            const result = await service.getLocalVideo(filename);

            expect(mockDownloadRepo.getByFilename).toHaveBeenCalledWith(filename);
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should try alternative filename format if first lookup fails', async () => {
            const filename = '/test/videos/local-video.mp4';
            mockDownloadRepo.getByFilename
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockDownloadedVideo);

            const result = await service.getLocalVideo(filename);

            expect(mockDownloadRepo.getByFilename).toHaveBeenCalledTimes(2);
            expect(mockDownloadRepo.getByFilename).toHaveBeenNthCalledWith(1, filename);
            expect(mockDownloadRepo.getByFilename).toHaveBeenNthCalledWith(2, 'local-video.mp4');
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should return null for unsupported URLs', async () => {
            const url = 'https://unsupported.com/video';

            const result = await service.getLocalVideo(url);

            expect(result).toBeNull();
        });
    });

    describe('downloadRange', () => {
        it('should download Twitch video from URL', async () => {
            const url = 'https://clips.twitch.tv/test';
            const options: DownloadVideoOptions = { range: { start: '00:01:00', end: '00:02:00' } };
            
            mockTwitchDl.downloadTwitchVideo.mockResolvedValue(mockTwitchDownload);
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);

            const result = await service.downloadRange(url, options);

            expect(result).toBe(mockDownloadedVideo);
        });

        it('should download YouTube video from URL', async () => {
            const url = 'https://www.youtube.com/watch?v=abc123';
            
            mockYtDlp.downloadYoutubeVideo.mockResolvedValue(mockYoutubeDownload);
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);

            const result = await service.downloadRange(url);

            expect(result).toBe(mockDownloadedVideo);
        });

        it('should get local video if available', async () => {
            const filename = 'local-video.mp4';
            mockDownloadRepo.getByFilename.mockResolvedValue(mockDownloadedVideo);

            const result = await service.downloadRange(filename);

            expect(mockDownloadRepo.getByFilename).toHaveBeenCalledWith(filename);
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should import local video if not in database', async () => {
            const filename = 'local-video.mp4';
            mockDownloadRepo.getByFilename.mockResolvedValue(null);
            mockFs.existsSync.mockReturnValue(true);
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);

            const result = await service.downloadRange(filename);

            expect(result).toBe(mockDownloadedVideo);
        });

        it('should throw error if video not found', async () => {
            const filename = 'nonexistent-video.mp4';
            mockDownloadRepo.getByFilename.mockResolvedValue(null);
            mockFs.existsSync.mockReturnValue(false);

            await expect(service.downloadRange(filename)).rejects.toThrow('Video not found');
        });
    });

    describe('extendDownloadedVideoData', () => {
        it('should add durationMilliseconds to downloaded video', () => {
            const result: ExtendedDownloadedVideo = service.extendDownloadedVideoData(mockDownloadedVideo);

            expect(result).toEqual({
                ...mockDownloadedVideo,
                durationMilliseconds: 120000, // 120 seconds * 1000
            });
        });

        it('should handle zero duration', () => {
            const videoWithZeroDuration = { ...mockDownloadedVideo, duration: 0 };
            
            const result = service.extendDownloadedVideoData(videoWithZeroDuration);

            expect(result.durationMilliseconds).toBe(0);
        });
    });

    describe('importLocalVideo', () => {
        const testFilename = 'local-video.mp4';

        beforeEach(() => {
            mockFFmpeg.getVideoDuration.mockResolvedValue(120);
            mockFFmpeg.getVideoResolution.mockResolvedValue({ width: 1920, height: 1080 });
            mockDownloadRepo.create.mockResolvedValue(mockDownloadedVideo);
        });

        it('should import local video successfully', async () => {
            mockFs.existsSync.mockReturnValue(true);

            const result = await service.importLocalVideo(testFilename);

            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/videos/local-video.mp4');
            expect(mockDownloadRepo.create).toHaveBeenCalledWith({
                title: testFilename,
                filename: testFilename,
                url: testFilename,
                platform: 'Local',
                platformId: testFilename,
                width: 1920,
                height: 1080,
                duration: 120,
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should return null if file does not exist', async () => {
            mockFs.existsSync.mockReturnValue(false);

            const result = await service.importLocalVideo(testFilename);

            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/videos/local-video.mp4');
            expect(mockDownloadRepo.create).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should handle FFmpeg errors during import', async () => {
            mockFs.existsSync.mockReturnValue(true);
            const error = new Error('FFmpeg resolution failed');
            mockFFmpeg.getVideoResolution.mockRejectedValue(error);

            await expect(service.importLocalVideo(testFilename)).rejects.toThrow('FFmpeg resolution failed');
        });
    });

    describe('constructor', () => {
        it('should initialize with provided dependencies', () => {
            const newService = new DownloadService(mockTwitchDl, mockFFmpeg, mockYtDlp, mockConfig, mockDownloadRepo);

            expect(newService).toBeInstanceOf(DownloadService);
            expect(newService['twitchDl']).toBe(mockTwitchDl);
            expect(newService['ffmpeg']).toBe(mockFFmpeg);
            expect(newService['ytDlp']).toBe(mockYtDlp);
            expect(newService['config']).toBe(mockConfig);
            expect(newService['downloadRepo']).toBe(mockDownloadRepo);
        });
    });
});
