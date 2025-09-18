import { exec } from "child_process";
import YtDlp from "../../externals/yt-dlp/yt-dlp";
import { DownloadVideoOptions } from "../../types/DownloadVideo.type";

// Mock child_process exec
jest.mock("child_process");
const mockExec = exec as jest.MockedFunction<typeof exec>;

// Mock utility functions
jest.mock("../../utilities/Url", () => ({
    getYoutubeVideoKey: jest.fn((url: string) => "mockVideoKey123")
}));

jest.mock("../../utilities/String", () => ({
    generateRandomString: jest.fn((length: number) => "abcd")
}));

jest.mock("../../utilities/Time", () => ({
    convertHHMMSSStringToSeconds: jest.fn((time: string) => {
        if (time === "00:01:30") return 90;
        if (time === "00:02:00") return 120;
        return 0;
    })
}));

describe("YtDlp", () => {
    let ytDlp: YtDlp;
    const mockUrl = "https://www.youtube.com/watch?v=mockVideoKey123";

    beforeEach(() => {
        ytDlp = new YtDlp();
        jest.clearAllMocks();
        
        // Set default environment for tests
        process.env.VIDEO_STORAGE_PATH = "./test-videos";
    });

    afterEach(() => {
        delete process.env.VIDEO_STORAGE_PATH;
    });

    describe("getYoutubeVideoData", () => {
        it("should return video title on successful execution", async () => {
            const mockTitle = "Test Video Title";
            const mockStdout = `${mockTitle}\n`;

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any, stdout: string, stderr: string) => void;
                cb(null, mockStdout, "");
                return {} as any;
            });

            const result = await ytDlp.getYoutubeVideoData(mockUrl);

            expect(result).toBe(mockTitle);
            expect(mockExec).toHaveBeenCalledWith(
                `yt-dlp --cookies-from-browser firefox --get-title ${mockUrl}`,
                expect.any(Function)
            );
        });

        it("should reject with stderr when stdout is empty", async () => {
            const mockError = "Video not found";

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any, stdout: string, stderr: string) => void;
                cb(null, "", mockError);
                return {} as any;
            });

            await expect(ytDlp.getYoutubeVideoData(mockUrl)).rejects.toBe(mockError);
        });

        it("should warn on error but resolve if stdout exists", async () => {
            const mockTitle = "Test Video Title";
            const mockStdout = `${mockTitle}\n`;
            const mockError = new Error("Warning message");
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any, stdout: string, stderr: string) => void;
                cb(mockError, mockStdout, "");
                return {} as any;
            });

            const result = await ytDlp.getYoutubeVideoData(mockUrl);

            expect(result).toBe(mockTitle);
            expect(consoleSpy).toHaveBeenCalledWith(mockError);
            
            consoleSpy.mockRestore();
        });
    });

    describe("downloadYoutubeVideo", () => {
        beforeEach(() => {
            // Mock getYoutubeVideoData
            jest.spyOn(ytDlp, 'getYoutubeVideoData').mockResolvedValue("Test Video Title");
        });

        it("should download video without options", async () => {
            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            const result = await ytDlp.downloadYoutubeVideo(mockUrl);

            expect(result).toEqual({
                id: "mockVideoKey123",
                title: "Test Video Title",
                filename: "youtube_mockVideoKey123_abcd.mp4"
            });

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('yt-dlp --cookies-from-browser firefox --paths "./test-videos" --merge-output-format mp4'),
                expect.any(Function)
            );
        });

        it("should download video with time range", async () => {
            const options: DownloadVideoOptions = {
                range: {
                    start: "00:01:30",
                    end: "00:02:00"
                }
            };

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            const result = await ytDlp.downloadYoutubeVideo(mockUrl, options);

            expect(result).toEqual({
                id: "mockVideoKey123",
                title: "Test Video Title",
                filename: "youtube_mockVideoKey123_range_00_01_30-00_02_00_abcd.mp4"
            });

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('--download-sections "*00:01:30-00:02:00"'),
                expect.any(Function)
            );
        });

        it("should download audio only when audioOnly option is true", async () => {
            const options: DownloadVideoOptions = {
                audioOnly: true
            };

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            const result = await ytDlp.downloadYoutubeVideo(mockUrl, options);

            expect(result).toEqual({
                id: "mockVideoKey123",
                title: "Test Video Title",
                filename: "youtube_mockVideoKey123_abcd.opus"
            });

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('-x'),
                expect.any(Function)
            );
            expect(mockExec).toHaveBeenCalledWith(
                expect.not.stringContaining('--merge-output-format'),
                expect.any(Function)
            );
        });

        it("should use IPv4 when ipv4 option is true", async () => {
            const options: DownloadVideoOptions = {
                ipv4: true
            };

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            await ytDlp.downloadYoutubeVideo(mockUrl, options);

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('-4'),
                expect.any(Function)
            );
        });

        it("should use custom path when provided", async () => {
            const options: DownloadVideoOptions = {
                path: "./custom-path"
            };

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            await ytDlp.downloadYoutubeVideo(mockUrl, options);

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('--paths "./custom-path"'),
                expect.any(Function)
            );
        });

        it("should use default path when no path option and no environment variable", async () => {
            delete process.env.VIDEO_STORAGE_PATH;

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            await ytDlp.downloadYoutubeVideo(mockUrl);

            expect(mockExec).toHaveBeenCalledWith(
                expect.stringContaining('--paths "./"'),
                expect.any(Function)
            );
        });

        it("should reject when exec returns error", async () => {
            const mockError = new Error("Download failed");

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(mockError);
                return {} as any;
            });

            await expect(ytDlp.downloadYoutubeVideo(mockUrl)).rejects.toBe(mockError);
        });

        it("should handle resolution options (legacy support)", async () => {
            const options: DownloadVideoOptions = {
                resolution: {
                    width: 1920,
                    height: 1080
                }
            };

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            const result = await ytDlp.downloadYoutubeVideo(mockUrl, options);

            expect(result).toEqual({
                id: "mockVideoKey123",
                title: "Test Video Title",
                filename: "youtube_mockVideoKey123_abcd.mp4"
            });
        });

        it("should log the command being executed", async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            mockExec.mockImplementation((command, callback) => {
                const cb = callback as (error: any) => void;
                cb(null);
                return {} as any;
            });

            await ytDlp.downloadYoutubeVideo(mockUrl);

            expect(consoleSpy).toHaveBeenCalledWith(
                "[Yt-Dlp] Downloading Youtube Video with command: ",
                expect.stringContaining('yt-dlp --cookies-from-browser firefox')
            );

            consoleSpy.mockRestore();
        });
    });
});
