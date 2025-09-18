import { convertHHMMSSStringToSeconds, convertSecondsToHHMMSSString } from '../../utilities/Time';

describe('Time utilities', () => {
    describe('convertHHMMSSStringToSeconds', () => {
        test('should convert seconds-only format', () => {
            expect(convertHHMMSSStringToSeconds('30')).toBe(30);
            expect(convertHHMMSSStringToSeconds('0')).toBe(0);
            expect(convertHHMMSSStringToSeconds('59')).toBe(59);
        });

        test('should convert MM:SS format', () => {
            expect(convertHHMMSSStringToSeconds('5:30')).toBe(330); // 5*60 + 30
            expect(convertHHMMSSStringToSeconds('0:30')).toBe(30);
            expect(convertHHMMSSStringToSeconds('1:00')).toBe(60);
            expect(convertHHMMSSStringToSeconds('59:59')).toBe(3599);
        });

        test('should convert HH:MM:SS format', () => {
            expect(convertHHMMSSStringToSeconds('1:30:45')).toBe(5445); // 1*3600 + 30*60 + 45
            expect(convertHHMMSSStringToSeconds('0:0:30')).toBe(30);
            expect(convertHHMMSSStringToSeconds('2:15:30')).toBe(8130);
            expect(convertHHMMSSStringToSeconds('23:59:59')).toBe(86399);
        });

        test('should throw error for invalid format', () => {
            expect(() => convertHHMMSSStringToSeconds('1:2:3:4')).toThrow('Invalid time format');
            expect(() => convertHHMMSSStringToSeconds('1:2:3:4:5')).toThrow('Invalid time format');
        });

        test('should handle edge cases', () => {
            expect(convertHHMMSSStringToSeconds('0:0:0')).toBe(0);
            expect(convertHHMMSSStringToSeconds('0:0')).toBe(0);
        });
    });

    describe('convertSecondsToHHMMSSString', () => {
        test('should convert seconds to HH:MM:SS format', () => {
            expect(convertSecondsToHHMMSSString(30)).toBe('0:00:30');
            expect(convertSecondsToHHMMSSString(60)).toBe('0:01:00');
            expect(convertSecondsToHHMMSSString(3661)).toBe('1:01:01'); // 1 hour, 1 minute, 1 second
        });

        test('should handle zero seconds', () => {
            expect(convertSecondsToHHMMSSString(0)).toBe('0:00:00');
        });

        test('should handle large values', () => {
            expect(convertSecondsToHHMMSSString(86399)).toBe('23:59:59'); // 23 hours, 59 minutes, 59 seconds
            expect(convertSecondsToHHMMSSString(90061)).toBe('25:01:01'); // More than 24 hours
        });

        test('should pad minutes and seconds with zeros', () => {
            expect(convertSecondsToHHMMSSString(61)).toBe('0:01:01');
            expect(convertSecondsToHHMMSSString(3605)).toBe('1:00:05');
            expect(convertSecondsToHHMMSSString(3665)).toBe('1:01:05');
        });

        test('should handle exact hour boundaries', () => {
            expect(convertSecondsToHHMMSSString(3600)).toBe('1:00:00'); // Exactly 1 hour
            expect(convertSecondsToHHMMSSString(7200)).toBe('2:00:00'); // Exactly 2 hours
        });

        test('should handle exact minute boundaries', () => {
            expect(convertSecondsToHHMMSSString(120)).toBe('0:02:00'); // Exactly 2 minutes
            expect(convertSecondsToHHMMSSString(1800)).toBe('0:30:00'); // Exactly 30 minutes
        });
    });

    describe('round-trip conversion', () => {
        test('should maintain consistency in round-trip conversions', () => {
            const timeStrings = ['1:30:45', '0:05:30', '23:59:59', '0:0:1'];
            
            timeStrings.forEach(timeString => {
                const seconds = convertHHMMSSStringToSeconds(timeString);
                const backToString = convertSecondsToHHMMSSString(seconds);
                const backToSeconds = convertHHMMSSStringToSeconds(backToString);
                
                expect(backToSeconds).toBe(seconds);
            });
        });

        test('should handle seconds-only and MM:SS formats in round-trip', () => {
            // Test seconds-only format
            const seconds30 = convertHHMMSSStringToSeconds('30');
            const backToString30 = convertSecondsToHHMMSSString(seconds30);
            expect(convertHHMMSSStringToSeconds(backToString30)).toBe(seconds30);

            // Test MM:SS format
            const secondsMMSS = convertHHMMSSStringToSeconds('5:30');
            const backToStringMMSS = convertSecondsToHHMMSSString(secondsMMSS);
            expect(convertHHMMSSStringToSeconds(backToStringMMSS)).toBe(secondsMMSS);
        });
    });
});
