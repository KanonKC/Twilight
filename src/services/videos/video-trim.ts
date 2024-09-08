// import { exec } from "child_process";
// import { DownloadVideo } from "../../models/types";
// import { VideoTrimResult } from "../../types/Video";

// export async function videoTrim(video:DownloadVideo,start:number,end:number):Promise<VideoTrimResult> {
//     return new Promise((resolve, reject) => {
// 		exec(
// 			`python src/modules/video-trim.py ${process.env.VIDEO_STORAGE_PATH}/${video.filename} ${start} ${end}`,
// 			(error, stdout, stderr) => {
// 				if (error) {
// 					console.warn(error);
// 				}
// 				if (stdout) {
// 					resolve({
//                         originalVideo: video,
//                         editedVideo: {
//                             ...video,
//                             id: stdout.split("[id]")[1],
//                             filename: stdout.split("[filename]")[1]
//                         },
//                         start,
//                         end
// })
// 				}
// 				else {
//                     throw new Error(stderr);
// 					// reject()
// 				}
// 			}
// 		);
// 	});
// }