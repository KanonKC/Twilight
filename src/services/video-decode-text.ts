import { exec } from "child_process";
import { DownloadedVideo } from "../types/Video";

export function decodeVideoText(url:string):Promise<DownloadedVideo> {
    return new Promise((resolve, reject) => {
        exec(
            `twitch-dl info --json ${url}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                if (stdout) {
                    resolve(JSON.parse(stdout))
                }
                else {
                    throw new Error(stderr);
                    // reject()
                }
            }
        );
    });
}