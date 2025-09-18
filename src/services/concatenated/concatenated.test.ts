import { ConcatenatedVideo, DownloadedVideo } from '@prisma/client';
import ConcatenatedService from './concatenated.service';
import FFmpeg from '../../externals/ffmpeg/ffmpeg';
import ConcatenatedVideoRepository from '../../repositories/concatenated/concatenated.repository';
import DownloadedVideoRepository from '../../repositories/download/download.repository';
import { CreateConcatenatedVideo } from '../../repositories/concatenated/response';

// Mock the dependencies
jest.mock('../../externals/ffmpeg/ffmpeg');
jest.mock('../../repositories/concatenated/concatenated.repository');
jest.mock('../../repositories/download/download.repository');

describe('ConcatenatedService', () => {
    let service: ConcatenatedService;
    let mockFFmpeg: jest.Mocked<FFmpeg>;
    let mockConcatRepo: jest.Mocked<ConcatenatedVideoRepository>;
    let mockDownloadRepo: jest.Mocked<DownloadedVideoRepository>;

    // Mock data
    const mockDownloadedVideos: DownloadedVideo[] = [
        {
            id: 1,
            title: 'Video 1',
            filename: 'video1.mp4',
            url: 'https://example.com/video1',
            duration: 120,
            platform: 'youtube',
            platformId: 'vid1',
            width: 1920,
            height: 1080,
            startTime: null,
            endTime: null,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        },
        {
            id: 2,
            title: 'Video 2',
            filename: 'video2.mp4',
            url: 'https://example.com/video2',
            duration: 150,
            platform: 'youtube',
            platformId: 'vid2',
            width: 1920,
            height: 1080,
            startTime: null,
            endTime: null,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        },
    ];

    const mockConcatenatedVideo: ConcatenatedVideo = {
        id: 1,
        title: 'Concatenated Video',
        filename: 'concat_abcd1234.mp4',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create mock instances
        mockFFmpeg = new FFmpeg({} as any) as jest.Mocked<FFmpeg>;
        mockConcatRepo = new ConcatenatedVideoRepository({} as any) as jest.Mocked<ConcatenatedVideoRepository>;
        mockDownloadRepo = new DownloadedVideoRepository({} as any) as jest.Mocked<DownloadedVideoRepository>;

        // Create service instance with mocked dependencies
        service = new ConcatenatedService(mockFFmpeg, mockConcatRepo, mockDownloadRepo);
    });

    describe('concatVideos', () => {
        const testFilenames = ['video1.mp4', 'video2.mp4'];
        const testTitle = 'Test Concatenated Video';
        const mockOutputFilename = 'concat_abcd1234.mp4';

        beforeEach(() => {
            // Setup default mock return values
            mockDownloadRepo.getByFilenames.mockResolvedValue(mockDownloadedVideos);
            mockFFmpeg.concatVideo.mockResolvedValue(mockOutputFilename);
            mockConcatRepo.create.mockResolvedValue(mockConcatenatedVideo);
        });

        it('should successfully concatenate videos with provided title', async () => {
            // Act
            const result = await service.concatVideos(testFilenames, testTitle);

            // Assert
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(testFilenames);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(testFilenames, testTitle);
            
            const expectedCreateData: CreateConcatenatedVideo = {
                title: testTitle,
                filename: mockOutputFilename,
                videoIds: [1, 2],
            };
            expect(mockConcatRepo.create).toHaveBeenCalledWith(expectedCreateData);
            expect(result).toEqual(mockConcatenatedVideo);
        });

        it('should use filename as title when title is undefined', async () => {
            // Act
            const result = await service.concatVideos(testFilenames, undefined);

            // Assert
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(testFilenames);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(testFilenames, undefined);
            
            const expectedCreateData: CreateConcatenatedVideo = {
                title: mockOutputFilename, // Should use filename as title
                filename: mockOutputFilename,
                videoIds: [1, 2],
            };
            expect(mockConcatRepo.create).toHaveBeenCalledWith(expectedCreateData);
            expect(result).toEqual(mockConcatenatedVideo);
        });

        it('should handle empty video list', async () => {
            // Arrange
            const emptyFilenames: string[] = [];
            mockDownloadRepo.getByFilenames.mockResolvedValue([]);

            // Act
            const result = await service.concatVideos(emptyFilenames, testTitle);

            // Assert
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(emptyFilenames);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(emptyFilenames, testTitle);
            
            const expectedCreateData: CreateConcatenatedVideo = {
                title: testTitle,
                filename: mockOutputFilename,
                videoIds: [], // Empty array for no videos
            };
            expect(mockConcatRepo.create).toHaveBeenCalledWith(expectedCreateData);
            expect(result).toEqual(mockConcatenatedVideo);
        });

        it('should handle single video concatenation', async () => {
            // Arrange
            const singleFilename = ['video1.mp4'];
            const singleVideo = [mockDownloadedVideos[0]];
            mockDownloadRepo.getByFilenames.mockResolvedValue(singleVideo);

            // Act
            const result = await service.concatVideos(singleFilename, testTitle);

            // Assert
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(singleFilename);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(singleFilename, testTitle);
            
            const expectedCreateData: CreateConcatenatedVideo = {
                title: testTitle,
                filename: mockOutputFilename,
                videoIds: [1],
            };
            expect(mockConcatRepo.create).toHaveBeenCalledWith(expectedCreateData);
            expect(result).toEqual(mockConcatenatedVideo);
        });

        it('should propagate error from download repository', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            mockDownloadRepo.getByFilenames.mockRejectedValue(error);

            // Act & Assert
            await expect(service.concatVideos(testFilenames, testTitle)).rejects.toThrow('Database connection failed');
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(testFilenames);
            expect(mockFFmpeg.concatVideo).not.toHaveBeenCalled();
            expect(mockConcatRepo.create).not.toHaveBeenCalled();
        });

        it('should propagate error from ffmpeg', async () => {
            // Arrange
            const error = new Error('FFmpeg concatenation failed');
            mockFFmpeg.concatVideo.mockRejectedValue(error);

            // Act & Assert
            await expect(service.concatVideos(testFilenames, testTitle)).rejects.toThrow('FFmpeg concatenation failed');
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(testFilenames);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(testFilenames, testTitle);
            expect(mockConcatRepo.create).not.toHaveBeenCalled();
        });

        it('should propagate error from concatenated repository', async () => {
            // Arrange
            const error = new Error('Failed to save concatenated video');
            mockConcatRepo.create.mockRejectedValue(error);

            // Act & Assert
            await expect(service.concatVideos(testFilenames, testTitle)).rejects.toThrow('Failed to save concatenated video');
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(testFilenames);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(testFilenames, testTitle);
            expect(mockConcatRepo.create).toHaveBeenCalled();
        });

        it('should handle videos with partial data', async () => {
            // Arrange
            const partialVideos: DownloadedVideo[] = [
                {
                    ...mockDownloadedVideos[0],
                    width: null,
                    height: null,
                },
            ];
            mockDownloadRepo.getByFilenames.mockResolvedValue(partialVideos);

            // Act
            const result = await service.concatVideos(['video1.mp4'], testTitle);

            // Assert
            expect(mockDownloadRepo.getByFilenames).toHaveBeenCalledWith(['video1.mp4']);
            expect(mockFFmpeg.concatVideo).toHaveBeenCalledWith(['video1.mp4'], testTitle);
            
            const expectedCreateData: CreateConcatenatedVideo = {
                title: testTitle,
                filename: mockOutputFilename,
                videoIds: [1],
            };
            expect(mockConcatRepo.create).toHaveBeenCalledWith(expectedCreateData);
            expect(result).toEqual(mockConcatenatedVideo);
        });
    });

    describe('constructor', () => {
        it('should initialize with provided dependencies', () => {
            // Act
            const newService = new ConcatenatedService(mockFFmpeg, mockConcatRepo, mockDownloadRepo);

            // Assert
            expect(newService).toBeInstanceOf(ConcatenatedService);
            expect(newService['ffmpeg']).toBe(mockFFmpeg);
            expect(newService['concatRepo']).toBe(mockConcatRepo);
            expect(newService['downloadRepo']).toBe(mockDownloadRepo);
        });
    });
});
