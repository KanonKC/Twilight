import { getYoutubeVideoKey, getTwitchVideoKey } from '../../utilities/Url';

describe('Url utilities', () => {
    describe('getYoutubeVideoKey', () => {
        test('should extract video ID from watch URL with v parameter', () => {
            const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ');
        });

        test('should extract video ID from watch URL with additional parameters', () => {
            const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLMfRYD4u-gLc2xqtYz&index=1';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ');
        });

        test('should extract video ID from live URL', () => {
            const url = 'https://www.youtube.com/live/dQw4w9WgXcQ';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ');
        });

        test('should extract video ID from youtu.be URL', () => {
            const url = 'https://youtu.be/dQw4w9WgXcQ';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ');
        });

        test('should extract video ID from youtu.be URL with parameters', () => {
            const url = 'https://youtu.be/dQw4w9WgXcQ?list=PLrAXtmRdnEQy6nuLMfRYD4u-gLc2xqtYz';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ');
        });

        test('should return the original URL if no recognized pattern', () => {
            const url = 'https://example.com/video';
            expect(getYoutubeVideoKey(url)).toBe(url);
        });

        test('should handle various watch URL formats', () => {
            expect(getYoutubeVideoKey('http://www.youtube.com/watch?v=abc123')).toBe('abc123');
            expect(getYoutubeVideoKey('https://youtube.com/watch?v=xyz789')).toBe('xyz789');
            expect(getYoutubeVideoKey('www.youtube.com/watch?v=test456')).toBe('test456');
        });

        test('should handle live URLs with additional path segments', () => {
            const url = 'https://www.youtube.com/live/dQw4w9WgXcQ/extra/path';
            expect(getYoutubeVideoKey(url)).toBe('dQw4w9WgXcQ/extra/path');
        });

        test('should handle edge cases with empty or malformed URLs', () => {
            expect(getYoutubeVideoKey('')).toBe('');
            expect(getYoutubeVideoKey('https://www.youtube.com/watch?v=')).toBe('');
            expect(getYoutubeVideoKey('https://www.youtube.com/live/')).toBe('');
            expect(getYoutubeVideoKey('https://youtu.be/')).toBe('');
        });
    });

    describe('getTwitchVideoKey', () => {
        test('should extract video ID from Twitch URL', () => {
            const url = 'https://www.twitch.tv/videos/123456789';
            expect(getTwitchVideoKey(url)).toBe('123456789');
        });

        test('should extract video ID from Twitch URL with additional parameters', () => {
            const url = 'https://www.twitch.tv/videos/123456789?t=1h30m';
            expect(getTwitchVideoKey(url)).toBe('123456789?t=1h30m');
        });

        test('should handle different Twitch URL formats', () => {
            expect(getTwitchVideoKey('twitch.tv/videos/987654321')).toBe('987654321');
            expect(getTwitchVideoKey('https://twitch.tv/videos/111222333')).toBe('111222333');
            expect(getTwitchVideoKey('http://www.twitch.tv/videos/444555666')).toBe('444555666');
        });

        test('should handle URLs with trailing slashes', () => {
            const url = 'https://www.twitch.tv/videos/123456789/';
            expect(getTwitchVideoKey(url)).toBe('');
        });

        test('should handle simple video IDs passed directly', () => {
            expect(getTwitchVideoKey('123456789')).toBe('123456789');
        });

        test('should handle URLs with multiple path segments', () => {
            const url = 'https://www.twitch.tv/directory/game/Just%20Chatting/videos/123456789';
            expect(getTwitchVideoKey(url)).toBe('123456789');
        });

        test('should handle edge cases', () => {
            expect(getTwitchVideoKey('')).toBe('');
            expect(getTwitchVideoKey('/')).toBe('');
            expect(getTwitchVideoKey('https://www.twitch.tv/')).toBe('');
        });

        test('should handle non-video Twitch URLs', () => {
            const url = 'https://www.twitch.tv/streamer_name';
            expect(getTwitchVideoKey(url)).toBe('streamer_name');
        });
    });
});
