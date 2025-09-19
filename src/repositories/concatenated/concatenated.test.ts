import { ConcatenatedVideo, PrismaClient } from '@prisma/client';
import ConcatenatedVideoRepository from './concatenated.repository';
import { CreateConcatenatedVideo } from './response';

// Mock the Prisma Client
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        concatenatedVideo: {
            create: jest.fn(),
        },
    })),
}));

describe('ConcatenatedVideoRepository', () => {
    let repository: ConcatenatedVideoRepository;
    let mockPrismaClient: jest.Mocked<PrismaClient>;
    let mockConcatenatedVideoCreate: jest.MockedFunction<any>;

    // Mock data
    const mockConcatenatedVideo: ConcatenatedVideo = {
        id: 1,
        title: 'Test Concatenated Video',
        filename: 'concat_test_12345.mp4',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    };

    const mockCreateRequest: CreateConcatenatedVideo = {
        title: 'Test Concatenated Video',
        filename: 'concat_test_12345.mp4',
        videoIds: [1, 2, 3],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock Prisma client
        mockConcatenatedVideoCreate = jest.fn();
        mockPrismaClient = {
            concatenatedVideo: {
                create: mockConcatenatedVideoCreate,
            },
        } as any;

        // Create repository instance with mock
        repository = new ConcatenatedVideoRepository(mockPrismaClient);
    });

    describe('create', () => {
        beforeEach(() => {
            mockConcatenatedVideoCreate.mockResolvedValue(mockConcatenatedVideo);
        });

        it('should create concatenated video with title and video IDs', async () => {
            const result = await repository.create(mockCreateRequest);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Test Concatenated Video',
                    filename: 'concat_test_12345.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [
                                { downloadedVideoId: 1 },
                                { downloadedVideoId: 2 },
                                { downloadedVideoId: 3 },
                            ],
                        },
                    },
                },
            });
            expect(result).toBe(mockConcatenatedVideo);
        });

        it('should use filename as title when title is null or undefined', async () => {
            const requestWithNullTitle: CreateConcatenatedVideo = {
                title: null as any,
                filename: 'test_filename.mp4',
                videoIds: [1, 2],
            };

            await repository.create(requestWithNullTitle);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'test_filename.mp4', // Should use filename as fallback
                    filename: 'test_filename.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [
                                { downloadedVideoId: 1 },
                                { downloadedVideoId: 2 },
                            ],
                        },
                    },
                },
            });
        });

        it('should use filename as title when title is undefined', async () => {
            const requestWithUndefinedTitle: CreateConcatenatedVideo = {
                title: undefined as any,
                filename: 'another_filename.mp4',
                videoIds: [5],
            };

            await repository.create(requestWithUndefinedTitle);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'another_filename.mp4', // Should use filename as fallback
                    filename: 'another_filename.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [
                                { downloadedVideoId: 5 },
                            ],
                        },
                    },
                },
            });
        });

        it('should handle empty video IDs array', async () => {
            const requestWithEmptyVideoIds: CreateConcatenatedVideo = {
                title: 'Empty Video List',
                filename: 'empty_concat.mp4',
                videoIds: [],
            };

            await repository.create(requestWithEmptyVideoIds);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Empty Video List',
                    filename: 'empty_concat.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [], // Empty array
                        },
                    },
                },
            });
        });

        it('should handle single video ID', async () => {
            const requestWithSingleVideo: CreateConcatenatedVideo = {
                title: 'Single Video',
                filename: 'single_video.mp4',
                videoIds: [42],
            };

            await repository.create(requestWithSingleVideo);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Single Video',
                    filename: 'single_video.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [
                                { downloadedVideoId: 42 },
                            ],
                        },
                    },
                },
            });
        });

        it('should handle large number of video IDs', async () => {
            const largeVideoIds = Array.from({ length: 100 }, (_, i) => i + 1);
            const requestWithManyVideos: CreateConcatenatedVideo = {
                title: 'Many Videos Concatenation',
                filename: 'many_videos.mp4',
                videoIds: largeVideoIds,
            };

            await repository.create(requestWithManyVideos);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Many Videos Concatenation',
                    filename: 'many_videos.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: largeVideoIds.map(id => ({ downloadedVideoId: id })),
                        },
                    },
                },
            });
        });

        it('should preserve exact title when provided', async () => {
            const requestWithSpecificTitle: CreateConcatenatedVideo = {
                title: 'Exact Title With Special Characters: @#$%',
                filename: 'special_chars.mp4',
                videoIds: [10, 20],
            };

            await repository.create(requestWithSpecificTitle);

            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Exact Title With Special Characters: @#$%',
                    filename: 'special_chars.mp4',
                    downloadedVideos: {
                        createMany: {
                            data: [
                                { downloadedVideoId: 10 },
                                { downloadedVideoId: 20 },
                            ],
                        },
                    },
                },
            });
        });

        it('should propagate Prisma errors', async () => {
            const prismaError = new Error('Database connection failed');
            mockConcatenatedVideoCreate.mockRejectedValue(prismaError);

            await expect(repository.create(mockCreateRequest)).rejects.toThrow('Database connection failed');
            expect(mockConcatenatedVideoCreate).toHaveBeenCalledTimes(1);
        });

        it('should handle Prisma constraint violation errors', async () => {
            const constraintError = new Error('Unique constraint failed');
            constraintError.name = 'PrismaClientKnownRequestError';
            mockConcatenatedVideoCreate.mockRejectedValue(constraintError);

            await expect(repository.create(mockCreateRequest)).rejects.toThrow('Unique constraint failed');
        });

        it('should handle foreign key constraint errors for video IDs', async () => {
            const foreignKeyError = new Error('Foreign key constraint failed on downloadedVideoId');
            mockConcatenatedVideoCreate.mockRejectedValue(foreignKeyError);

            const requestWithInvalidVideoIds: CreateConcatenatedVideo = {
                title: 'Invalid Video IDs',
                filename: 'invalid_refs.mp4',
                videoIds: [999, 1000], // Non-existent video IDs
            };

            await expect(repository.create(requestWithInvalidVideoIds)).rejects.toThrow('Foreign key constraint failed on downloadedVideoId');
        });
    });

    describe('constructor', () => {
        it('should initialize with provided Prisma client', () => {
            const newRepository = new ConcatenatedVideoRepository(mockPrismaClient);

            expect(newRepository).toBeInstanceOf(ConcatenatedVideoRepository);
            expect(newRepository['prisma']).toBe(mockPrismaClient);
        });

        it('should implement IConcatenatedVideoRepository interface', () => {
            expect(repository).toHaveProperty('create');
            expect(typeof repository.create).toBe('function');
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex concatenation with metadata', async () => {
            const complexRequest: CreateConcatenatedVideo = {
                title: 'Complex Video: Part 1 + Part 2 + Highlights',
                filename: 'complex_concat_xyz789.mp4',
                videoIds: [101, 102, 103, 104, 105],
            };

            const complexResult: ConcatenatedVideo = {
                id: 999,
                title: complexRequest.title,
                filename: complexRequest.filename,
                createdAt: new Date('2023-12-25T10:30:00.000Z'),
                updatedAt: new Date('2023-12-25T10:30:00.000Z'),
            };

            mockConcatenatedVideoCreate.mockResolvedValue(complexResult);

            const result = await repository.create(complexRequest);

            expect(result).toBe(complexResult);
            expect(mockConcatenatedVideoCreate).toHaveBeenCalledWith({
                data: {
                    title: complexRequest.title,
                    filename: complexRequest.filename,
                    downloadedVideos: {
                        createMany: {
                            data: complexRequest.videoIds.map(id => ({ downloadedVideoId: id })),
                        },
                    },
                },
            });
        });
    });
});
