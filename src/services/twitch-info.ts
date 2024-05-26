import { exec } from "child_process";
import { TwitchVideo } from "../types/Video";

export function getTwitchVideoInfo(url:string):Promise<TwitchVideo> {
    return new Promise((resolve, reject) => {
        exec(
            `twitch-dl info --json ${url}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                if (stdout) {
                    resolve(JSON.parse(stdout) as TwitchVideo)
                }
                else {
                    throw new Error(stderr);
                    // reject()
                }
            }
        );
    });
}