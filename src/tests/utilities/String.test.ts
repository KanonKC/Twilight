import { generateRandomString, escapeUnicode } from '../../utilities/String';

describe('String utilities', () => {
    describe('generateRandomString', () => {
        test('should generate a string of correct length', () => {
            const length = 10;
            const result = generateRandomString(length);
            expect(result).toHaveLength(length);
        });

        test('should generate different strings on multiple calls', () => {
            const length = 10;
            const result1 = generateRandomString(length);
            const result2 = generateRandomString(length);
            expect(result1).not.toBe(result2);
        });

        test('should generate empty string for length 0', () => {
            const result = generateRandomString(0);
            expect(result).toBe('');
        });

        test('should only contain alphanumeric characters', () => {
            const result = generateRandomString(100);
            const validChars = /^[A-Za-z0-9]+$/;
            expect(result).toMatch(validChars);
        });

        test('should handle large length values', () => {
            const length = 1000;
            const result = generateRandomString(length);
            expect(result).toHaveLength(length);
        });
    });

    describe('escapeUnicode', () => {
        test('should escape unicode characters', () => {
            const input = 'Hello 世界';
            const result = escapeUnicode(input);
            expect(result).toBe('Hello \\u4e16\\u754c');
        });

        test('should leave ASCII characters unchanged', () => {
            const input = 'Hello World 123 !@#$%^&*()';
            const result = escapeUnicode(input);
            expect(result).toBe(input);
        });

        test('should handle empty string', () => {
            const result = escapeUnicode('');
            expect(result).toBe('');
        });

        test('should handle string with only unicode characters', () => {
            const input = '你好世界';
            const result = escapeUnicode(input);
            expect(result).toBe('\\u4f60\\u597d\\u4e16\\u754c');
        });

        test('should handle mixed ASCII and unicode characters', () => {
            const input = 'Test 测试 123';
            const result = escapeUnicode(input);
            expect(result).toBe('Test \\u6d4b\\u8bd5 123');
        });

        test('should handle emojis', () => {
            const input = 'Hello 😀';
            const result = escapeUnicode(input);
            expect(result).toBe('Hello \\ud83d\\ude00');
        });

        test('should handle special unicode characters', () => {
            const input = 'Copyright © Symbol';
            const result = escapeUnicode(input);
            expect(result).toBe('Copyright \\u00a9 Symbol');
        });
    });
});
