import { exec } from "child_process";
import { TwitchVideo } from "../../../types/DownloadVideo.type";

export function getTwitchVideoData(url:string):Promise<TwitchVideo> {
    return new Promise((resolve, reject) => {
        exec(
            `twitch-dl info --json ${url}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                if (stdout) {

                    const jsonString = '{"id": "2475756425", "slug": "PopularBombasticShieldYouWHY-DTpHdAneLrO8HNFs", "title": "\u0e08\u0e39\u0e49\u0e04\u0e23\u0e34\u0e19\u0e41\u0e1a\u0e1a\u0e42\u0e04\u0e15\u0e23\u0e42\u0e2b\u0e14", "createdAt": "2024-05-04T07:26:07Z", "viewCount": 101, "durationSeconds": 38, "url": "https://clips.twitch.tv/PopularBombasticShieldYouWHY-DTpHdAneLrO8HNFs", "videoQualities": [{"frameRate": 60.02604166666667, "quality": "1080", "sourceURL": "https://production.assets.clips.twitchcdn.net/ceAnsA06R3QJ3i6zvBzRbA/AT-cm%7CceAnsA06R3QJ3i6zvBzRbA.mp4"}, {"frameRate": 60.02604166666667, "quality": "720", "sourceURL": "https://production.assets.clips.twitchcdn.net/ceAnsA06R3QJ3i6zvBzRbA/AT-cm%7CceAnsA06R3QJ3i6zvBzRbA-720.mp4"}, {"frameRate": 30.026041666666668, "quality": "480", "sourceURL": "https://production.assets.clips.twitchcdn.net/ceAnsA06R3QJ3i6zvBzRbA/AT-cm%7CceAnsA06R3QJ3i6zvBzRbA-480.mp4"}, {"frameRate": 30.026041666666668, "quality": "360", "sourceURL": "https://production.assets.clips.twitchcdn.net/ceAnsA06R3QJ3i6zvBzRbA/AT-cm%7CceAnsA06R3QJ3i6zvBzRbA-360.mp4"}], "game": {"id": "491487", "name": "Dead by Daylight"}, "broadcaster": {"displayName": "CxllMxBx_xl", "login": "cxllmxbx_xl"}}'


                    const result1 = jsonString.replace(/[^\0-~]/g, "");

                    // console.log(JSON.parse(result1))

                    // console.log('------------------------------')
                    // // Remove unicode characters from the string
                    // let result = String(stdout).replace(/[^\0-~]/g, "");
                    // console.log(result)
                    resolve(JSON.parse(result1) as TwitchVideo)
                }
                else {
                    reject(stderr)
                }
            }
        );
    });
}