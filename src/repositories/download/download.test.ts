import { DownloadedVideo, PrismaClient } from '@prisma/client';
import DownloadedVideoRepository from './download.repository';
import { CreateDownloadedVideo } from './response';

// Mock the Prisma Client
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        downloadedVideo: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
    })),
}));

describe('DownloadedVideoRepository', () => {
    let repository: DownloadedVideoRepository;
    let mockPrismaClient: jest.Mocked<PrismaClient>;
    let mockDownloadedVideoCreate: jest.MockedFunction<any>;
    let mockDownloadedVideoFindFirst: jest.MockedFunction<any>;
    let mockDownloadedVideoFindMany: jest.MockedFunction<any>;

    // Mock data
    const mockDownloadedVideo: DownloadedVideo = {
        id: 1,
        title: 'Test Video',
        filename: 'test_video.mp4',
        url: 'https://www.youtube.com/watch?v=abc123',
        duration: 120,
        platform: 'Youtube',
        platformId: 'abc123',
        width: 1920,
        height: 1080,
        startTime: null,
        endTime: null,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    };

    const mockCreateRequest: CreateDownloadedVideo = {
        title: 'Test Video',
        filename: 'test_video.mp4',
        url: 'https://www.youtube.com/watch?v=abc123',
        duration: 120,
        platform: 'Youtube',
        platformId: 'abc123',
        width: 1920,
        height: 1080,
        startTime: 30,
        endTime: 90,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock Prisma client
        mockDownloadedVideoCreate = jest.fn();
        mockDownloadedVideoFindFirst = jest.fn();
        mockDownloadedVideoFindMany = jest.fn();
        
        mockPrismaClient = {
            downloadedVideo: {
                create: mockDownloadedVideoCreate,
                findFirst: mockDownloadedVideoFindFirst,
                findMany: mockDownloadedVideoFindMany,
            },
        } as any;

        // Create repository instance with mock
        repository = new DownloadedVideoRepository(mockPrismaClient);
    });

    describe('create', () => {
        beforeEach(() => {
            mockDownloadedVideoCreate.mockResolvedValue(mockDownloadedVideo);
        });

        it('should create downloaded video with all fields', async () => {
            const result = await repository.create(mockCreateRequest);

            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Test Video',
                    filename: 'test_video.mp4',
                    url: 'https://www.youtube.com/watch?v=abc123',
                    duration: 120,
                    platform: 'Youtube',
                    platformId: 'abc123',
                    width: 1920,
                    height: 1080,
                    startTime: 30,
                    endTime: 90,
                },
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should create downloaded video without optional fields', async () => {
            const requestWithoutOptionalFields: CreateDownloadedVideo = {
                title: 'Simple Video',
                filename: 'simple_video.mp4',
                url: 'https://clips.twitch.tv/test',
                duration: 60,
                platform: 'Twitch',
                platformId: 'twitch123',
                width: 1280,
                height: 720,
            };

            await repository.create(requestWithoutOptionalFields);

            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Simple Video',
                    filename: 'simple_video.mp4',
                    url: 'https://clips.twitch.tv/test',
                    duration: 60,
                    platform: 'Twitch',
                    platformId: 'twitch123',
                    width: 1280,
                    height: 720,
                    startTime: undefined,
                    endTime: undefined,
                },
            });
        });

        it('should create local video entry', async () => {
            const localVideoRequest: CreateDownloadedVideo = {
                title: 'Local Video File',
                filename: 'local_video.mp4',
                url: '/path/to/local_video.mp4',
                duration: 180,
                platform: 'Local',
                platformId: 'local_video.mp4',
                width: 1920,
                height: 1080,
            };

            await repository.create(localVideoRequest);

            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Local Video File',
                    filename: 'local_video.mp4',
                    url: '/path/to/local_video.mp4',
                    duration: 180,
                    platform: 'Local',
                    platformId: 'local_video.mp4',
                    width: 1920,
                    height: 1080,
                    startTime: undefined,
                    endTime: undefined,
                },
            });
        });

        it('should handle zero start and end times', async () => {
            const requestWithZeroTimes: CreateDownloadedVideo = {
                ...mockCreateRequest,
                startTime: 0,
                endTime: 0,
            };

            await repository.create(requestWithZeroTimes);

            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: {
                    ...mockCreateRequest,
                    startTime: 0,
                    endTime: 0,
                },
            });
        });

        it('should propagate Prisma errors', async () => {
            const prismaError = new Error('Database connection failed');
            mockDownloadedVideoCreate.mockRejectedValue(prismaError);

            await expect(repository.create(mockCreateRequest)).rejects.toThrow('Database connection failed');
        });

        it('should handle constraint violations', async () => {
            const constraintError = new Error('Unique constraint failed on platformId');
            mockDownloadedVideoCreate.mockRejectedValue(constraintError);

            await expect(repository.create(mockCreateRequest)).rejects.toThrow('Unique constraint failed on platformId');
        });
    });

    describe('getByFilename', () => {
        it('should return video when filename exists', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(mockDownloadedVideo);

            const result = await repository.getByFilename('test_video.mp4');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    filename: 'test_video.mp4',
                },
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should return null when filename does not exist', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(null);

            const result = await repository.getByFilename('nonexistent.mp4');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    filename: 'nonexistent.mp4',
                },
            });
            expect(result).toBeNull();
        });

        it('should handle special characters in filename', async () => {
            const specialFilename = 'video_with_special_chars@#$%.mp4';
            mockDownloadedVideoFindFirst.mockResolvedValue(mockDownloadedVideo);

            await repository.getByFilename(specialFilename);

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    filename: specialFilename,
                },
            });
        });

        it('should handle empty filename', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(null);

            const result = await repository.getByFilename('');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    filename: '',
                },
            });
            expect(result).toBeNull();
        });

        it('should propagate database errors', async () => {
            const dbError = new Error('Database query failed');
            mockDownloadedVideoFindFirst.mockRejectedValue(dbError);

            await expect(repository.getByFilename('test.mp4')).rejects.toThrow('Database query failed');
        });
    });

    describe('getByFilenames', () => {
        const mockMultipleVideos: DownloadedVideo[] = [
            { ...mockDownloadedVideo, id: 1, filename: 'video1.mp4' },
            { ...mockDownloadedVideo, id: 2, filename: 'video2.mp4' },
            { ...mockDownloadedVideo, id: 3, filename: 'video3.mp4' },
        ];

        it('should return videos for existing filenames', async () => {
            mockDownloadedVideoFindMany.mockResolvedValue(mockMultipleVideos);

            const filenames = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
            const result = await repository.getByFilenames(filenames);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: filenames,
                    },
                },
            });
            expect(result).toBe(mockMultipleVideos);
            expect(result).toHaveLength(3);
        });

        it('should return empty array when no filenames match', async () => {
            mockDownloadedVideoFindMany.mockResolvedValue([]);

            const result = await repository.getByFilenames(['nonexistent1.mp4', 'nonexistent2.mp4']);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: ['nonexistent1.mp4', 'nonexistent2.mp4'],
                    },
                },
            });
            expect(result).toEqual([]);
        });

        it('should handle empty filenames array', async () => {
            mockDownloadedVideoFindMany.mockResolvedValue([]);

            const result = await repository.getByFilenames([]);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: [],
                    },
                },
            });
            expect(result).toEqual([]);
        });

        it('should handle single filename in array', async () => {
            const singleVideo = [mockMultipleVideos[0]];
            mockDownloadedVideoFindMany.mockResolvedValue(singleVideo);

            const result = await repository.getByFilenames(['video1.mp4']);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: ['video1.mp4'],
                    },
                },
            });
            expect(result).toBe(singleVideo);
        });

        it('should handle partial matches', async () => {
            const partialResults = [mockMultipleVideos[0], mockMultipleVideos[2]];
            mockDownloadedVideoFindMany.mockResolvedValue(partialResults);

            const result = await repository.getByFilenames(['video1.mp4', 'nonexistent.mp4', 'video3.mp4']);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: ['video1.mp4', 'nonexistent.mp4', 'video3.mp4'],
                    },
                },
            });
            expect(result).toHaveLength(2);
        });

        it('should handle large arrays of filenames', async () => {
            const largeFilenameArray = Array.from({ length: 100 }, (_, i) => `video${i}.mp4`);
            mockDownloadedVideoFindMany.mockResolvedValue([]);

            await repository.getByFilenames(largeFilenameArray);

            expect(mockDownloadedVideoFindMany).toHaveBeenCalledWith({
                where: {
                    filename: {
                        in: largeFilenameArray,
                    },
                },
            });
        });

        it('should propagate database errors', async () => {
            const dbError = new Error('Database query failed');
            mockDownloadedVideoFindMany.mockRejectedValue(dbError);

            await expect(repository.getByFilenames(['test.mp4'])).rejects.toThrow('Database query failed');
        });
    });

    describe('getByPlatform', () => {
        it('should return video for existing platform and platformId', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(mockDownloadedVideo);

            const result = await repository.getByPlatform('Youtube', 'abc123');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'Youtube',
                    platformId: 'abc123',
                },
            });
            expect(result).toBe(mockDownloadedVideo);
        });

        it('should return null when platform/platformId combination does not exist', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(null);

            const result = await repository.getByPlatform('Youtube', 'nonexistent');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'Youtube',
                    platformId: 'nonexistent',
                },
            });
            expect(result).toBeNull();
        });

        it('should handle Twitch platform queries', async () => {
            const twitchVideo: DownloadedVideo = {
                ...mockDownloadedVideo,
                platform: 'Twitch',
                platformId: 'twitch123',
                url: 'https://clips.twitch.tv/test',
            };
            mockDownloadedVideoFindFirst.mockResolvedValue(twitchVideo);

            const result = await repository.getByPlatform('Twitch', 'twitch123');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'Twitch',
                    platformId: 'twitch123',
                },
            });
            expect(result).toBe(twitchVideo);
        });

        it('should handle Local platform queries', async () => {
            const localVideo: DownloadedVideo = {
                ...mockDownloadedVideo,
                platform: 'Local',
                platformId: 'local_video.mp4',
                url: '/path/to/local_video.mp4',
            };
            mockDownloadedVideoFindFirst.mockResolvedValue(localVideo);

            const result = await repository.getByPlatform('Local', 'local_video.mp4');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'Local',
                    platformId: 'local_video.mp4',
                },
            });
            expect(result).toBe(localVideo);
        });

        it('should handle case-sensitive platform names', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(null);

            await repository.getByPlatform('youtube', 'abc123'); // lowercase

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'youtube',
                    platformId: 'abc123',
                },
            });
        });

        it('should handle special characters in platformId', async () => {
            const specialPlatformId = 'platform_id_with@special#chars';
            mockDownloadedVideoFindFirst.mockResolvedValue(mockDownloadedVideo);

            await repository.getByPlatform('Youtube', specialPlatformId);

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: 'Youtube',
                    platformId: specialPlatformId,
                },
            });
        });

        it('should handle empty platform and platformId', async () => {
            mockDownloadedVideoFindFirst.mockResolvedValue(null);

            const result = await repository.getByPlatform('', '');

            expect(mockDownloadedVideoFindFirst).toHaveBeenCalledWith({
                where: {
                    platform: '',
                    platformId: '',
                },
            });
            expect(result).toBeNull();
        });

        it('should propagate database errors', async () => {
            const dbError = new Error('Database connection lost');
            mockDownloadedVideoFindFirst.mockRejectedValue(dbError);

            await expect(repository.getByPlatform('Youtube', 'abc123')).rejects.toThrow('Database connection lost');
        });
    });

    describe('constructor', () => {
        it('should initialize with provided Prisma client', () => {
            const newRepository = new DownloadedVideoRepository(mockPrismaClient);

            expect(newRepository).toBeInstanceOf(DownloadedVideoRepository);
            expect(newRepository['prisma']).toBe(mockPrismaClient);
        });

        it('should implement IDownloadedVideoRepository interface', () => {
            expect(repository).toHaveProperty('create');
            expect(repository).toHaveProperty('getByFilename');
            expect(repository).toHaveProperty('getByFilenames');
            expect(repository).toHaveProperty('getByPlatform');
            
            expect(typeof repository.create).toBe('function');
            expect(typeof repository.getByFilename).toBe('function');
            expect(typeof repository.getByFilenames).toBe('function');
            expect(typeof repository.getByPlatform).toBe('function');
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex video metadata', async () => {
            const complexRequest: CreateDownloadedVideo = {
                title: 'Complex Video: Gaming Highlights [4K] - Part 1/3',
                filename: 'gaming_highlights_4k_part1_abc123def456.mp4',
                url: 'https://www.youtube.com/watch?v=complexVideoId123',
                duration: 3600, // 1 hour
                platform: 'Youtube',
                platformId: 'complexVideoId123',
                width: 3840,
                height: 2160,
                startTime: 600, // 10 minutes
                endTime: 4200, // 70 minutes
            };

            const complexResult: DownloadedVideo = {
                id: 999,
                ...complexRequest,
                startTime: 600,
                endTime: 4200,
                createdAt: new Date('2023-12-25T10:30:00.000Z'),
                updatedAt: new Date('2023-12-25T10:30:00.000Z'),
            };

            mockDownloadedVideoCreate.mockResolvedValue(complexResult);

            const result = await repository.create(complexRequest);

            expect(result).toBe(complexResult);
            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: complexRequest,
            });
        });

        it('should handle video with null dimensions', async () => {
            const requestWithNullDimensions: CreateDownloadedVideo = {
                title: 'Audio Only Content',
                filename: 'audio_only.mp4',
                url: 'https://example.com/audio',
                duration: 300,
                platform: 'Custom',
                platformId: 'audio123',
                width: 0, // No video track
                height: 0,
            };

            await repository.create(requestWithNullDimensions);

            expect(mockDownloadedVideoCreate).toHaveBeenCalledWith({
                data: requestWithNullDimensions,
            });
        });
    });
});
