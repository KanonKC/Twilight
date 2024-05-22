import { exec } from "child_process";
import { DownloadedVideo, VideoTrimResult } from "../types/Video";

export async function videoTrim(video:DownloadedVideo,start:number,end:number):Promise<VideoTrimResult> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/video-trim.py src/dumps/${video.filaneme} ${start} ${end}`,
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
                            filaneme: stdout.split("[filename]")[1]
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