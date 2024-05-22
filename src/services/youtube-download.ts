import { exec } from "child_process";

export interface DownloadedVideo {
    id: string;
    filaneme: string;
    platform: {
        name: "Youtube";
        id: string;
    }
    title: string;
}

export async function youtubeDownload(url:string):Promise<DownloadedVideo> {
    return new Promise((resolve, reject) => {
		exec(
			`python src/modules/youtube-download.py ${url}`,
			(error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {
					resolve({
                        id: stdout.split("[video_unique_id]")[1],
                        filaneme: stdout.split("[filename]")[1],
                        platform: {
                            name: "Youtube",
                            id: stdout.split("[platform_id]")[1],
                        },
                        title: stdout.split("[video_title]")[1],
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