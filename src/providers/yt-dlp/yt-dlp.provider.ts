import { exec } from 'child_process';
import { DownloadVideoOptions } from '../../types/DownloadVideo.type';
import { generateRandomString } from '../../utilities/String';
import { getYoutubeVideoKey } from '../../utilities/Url';
import { DownloadYoutubeVideo } from './response';

export abstract class IYtDlp {
    abstract getYoutubeVideoData(url: string): Promise<string>;
    abstract downloadYoutubeVideo(url: string, options?: DownloadVideoOptions): Promise<DownloadYoutubeVideo>;
}

export default class YtDlp implements IYtDlp {
    constructor() {}

    async getYoutubeVideoData(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`yt-dlp --cookies-from-browser firefox --get-title ${url}`, (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                if (stdout) {
                    resolve(stdout.slice(0, stdout.length - 1));
                } else {
                    reject(stderr);
                }
            });
        });
    }

    async downloadYoutubeVideo(url: string, options?: DownloadVideoOptions): Promise<DownloadYoutubeVideo> {
        const videoKey = getYoutubeVideoKey(url);

        let filename: string;
        // let command: string;

        let start: string | undefined;
        let end: string | undefined;
        let fileType = 'mp4';
        if (options) {
            if (options.range) {
                start = options.range.start;
                end = options.range.end;
            }
        }
        const path = options?.path || process.env.VIDEO_STORAGE_PATH || './';
        const videoInfo = await this.getYoutubeVideoData(url);
        // const baseCommand = `yt-dlp --paths "./${path}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
        // const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${path}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
        // Claude-4: const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${path}" -f "bestvideo[height=1080][fps=60]+bestaudio[ext=mp4]/bestvideo[height=1080]+bestaudio[ext=mp4]/best" --merge-output-format mp4`

        // const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${path}" --merge-output-format ${fileType}`;
        const command = ['yt-dlp', '--cookies-from-browser', 'firefox', '--paths', path, '--merge-output-format', fileType];

        if (options?.customFormat) {
            command.push('-f', options.customFormat);
        }

        if (start && end) {
            const startText = start.split(':').join('_');
            const endText = end.split(':').join('_');
            filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(4)}`;
            command.push('--download-sections', `"*${start}-${end}"`);
        } else {
            filename = `youtube_${videoKey}_${generateRandomString(4)}`;
        }

        filename = `${filename}.${fileType}`;
        command.push(videoKey, '-o', filename);

        if (true) {
            // TODO: Handle IPv4 options flag
            command.push('-4');
        }

        console.log('[Yt-Dlp] Downloading Youtube Video with command: ', command.join(' '));

        return new Promise((resolve, reject) => {
            exec(command.join(' '), async (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        id: videoKey,
                        title: videoInfo,
                        filename: filename,
                    });
                }
            });
        });
    }
}
