import { DownloadedVideo } from '@prisma/client';
import { extendDownloadedVideoData } from '../../utilities/Video';
import { ExtendedDownloadedVideo } from '../../types/DownloadVideo.type';

describe('Video utilities', () => {
    describe('extendDownloadedVideoData', () => {
        const mockDownloadedVideo: DownloadedVideo = {
            id: 1,
            filename: 'test-video.mp4',
            platform: 'youtube',
            platformId: 'dQw4w9WgXcQ',
            url: 'https://example.com/video',
            title: 'Test Video',
            width: 1920,
            height: 1080,
            startTime: null,
            endTime: null,
            duration: 120, // 120 seconds
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-01T00:00:00Z')
        };

        test('should extend downloaded video with durationMilliseconds', () => {
            const result = extendDownloadedVideoData(mockDownloadedVideo);
            
            expect(result).toEqual({
                ...mockDownloadedVideo,
                durationMilliseconds: 120000 // 120 seconds * 1000
            });
        });

        test('should preserve all original properties', () => {
            const result = extendDownloadedVideoData(mockDownloadedVideo);
            
            expect(result.id).toBe(mockDownloadedVideo.id);
            expect(result.filename).toBe(mockDownloadedVideo.filename);
            expect(result.platform).toBe(mockDownloadedVideo.platform);
            expect(result.platformId).toBe(mockDownloadedVideo.platformId);
            expect(result.url).toBe(mockDownloadedVideo.url);
            expect(result.title).toBe(mockDownloadedVideo.title);
            expect(result.width).toBe(mockDownloadedVideo.width);
            expect(result.height).toBe(mockDownloadedVideo.height);
            expect(result.startTime).toBe(mockDownloadedVideo.startTime);
            expect(result.endTime).toBe(mockDownloadedVideo.endTime);
            expect(result.duration).toBe(mockDownloadedVideo.duration);
            expect(result.createdAt).toBe(mockDownloadedVideo.createdAt);
            expect(result.updatedAt).toBe(mockDownloadedVideo.updatedAt);
        });

        test('should calculate durationMilliseconds correctly for various durations', () => {
            const testCases = [
                { duration: 0, expectedMilliseconds: 0 },
                { duration: 1, expectedMilliseconds: 1000 },
                { duration: 60, expectedMilliseconds: 60000 },
                { duration: 3600, expectedMilliseconds: 3600000 },
                { duration: 1.5, expectedMilliseconds: 1500 }
            ];

            testCases.forEach(({ duration, expectedMilliseconds }) => {
                const videoWithDuration = { ...mockDownloadedVideo, duration };
                const result = extendDownloadedVideoData(videoWithDuration);
                
                expect(result.durationMilliseconds).toBe(expectedMilliseconds);
            });
        });

        test('should handle decimal duration values', () => {
            const videoWithDecimalDuration = { 
                ...mockDownloadedVideo, 
                duration: 123.456 
            };
            
            const result = extendDownloadedVideoData(videoWithDecimalDuration);
            
            expect(result.durationMilliseconds).toBe(123456);
        });

        test('should handle zero duration', () => {
            const videoWithZeroDuration = { 
                ...mockDownloadedVideo, 
                duration: 0 
            };
            
            const result = extendDownloadedVideoData(videoWithZeroDuration);
            
            expect(result.durationMilliseconds).toBe(0);
        });

        test('should handle large duration values', () => {
            const videoWithLargeDuration = { 
                ...mockDownloadedVideo, 
                duration: 86400 // 24 hours in seconds
            };
            
            const result = extendDownloadedVideoData(videoWithLargeDuration);
            
            expect(result.durationMilliseconds).toBe(86400000);
        });

        test('should return ExtendedDownloadedVideo type', () => {
            const result = extendDownloadedVideoData(mockDownloadedVideo);
            
            // Type assertion to ensure it matches the expected interface
            const extendedVideo: ExtendedDownloadedVideo = result;
            
            expect(extendedVideo.durationMilliseconds).toBeDefined();
            expect(typeof extendedVideo.durationMilliseconds).toBe('number');
        });

        test('should not mutate the original object', () => {
            const originalDuration = mockDownloadedVideo.duration;
            const originalObject = { ...mockDownloadedVideo };
            
            extendDownloadedVideoData(mockDownloadedVideo);
            
            expect(mockDownloadedVideo).toEqual(originalObject);
            expect(mockDownloadedVideo.duration).toBe(originalDuration);
        });
    });
});
