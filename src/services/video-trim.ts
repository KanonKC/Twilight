import { exec } from "child_process";
import { DownloadedVideo, VideoTrimResult } from "../types/Video";
import { DownloadVideoAttribute } from "../models/DownloadedVideo.model";

export async function videoTrim(video:DownloadVideoAttribute,start:number,end:number):Promise<VideoTrimResult> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/video-trim.py src/dumps/${video.filename} ${start} ${end}`,
			(error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {
					resolve({
                        originalVideo: video,
                        editedVideo: {
                            ...video,
                            id: stdout.split("[id]")[1],
                            filename: stdout.split("[filename]")[1]
                        },
                        start,
                        end
})
				}
				else {
                    throw new Error(stderr);
					// reject()
				}
			}
		);
	});
}