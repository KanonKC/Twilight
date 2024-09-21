import { exec } from "child_process";
import { YoutubeVideo } from "../../../types/DownloadVideo.type";

export function getYoutubeVideoData(url:string):Promise<YoutubeVideo> {
    return new Promise((resolve, reject) => {
        exec(
            `yt-dlp --cookies-from-browser firefox --get-title ${url}`,
            (error, stdout, stderr) => {

                const output = {
                    title: stdout.slice(0, stdout.length - 1)
                }

                if (error) {
                    console.warn(error);
                }
                if (stdout) {
                    resolve(output as YoutubeVideo)
                }
                else {
                    // throw new Error(stderr);
                    reject(stderr)
                }
            }
        );
    });
}