import config from '../src/configs';
import DownloadAndUploadVideoScript, { DownloadAndUploadVideoRequest } from '../src/scripts/download-and-upload-video';

function sendDiscordWebhook(key: string) {
    const webhookUrl = 'https://discord.com/api/webhooks/1408156500525842452/6-KBd8sH1s7lTHfJxb1pvXzqAbbaLBAUbfGzx7LWmkK4iG3HzfsvIl7XIfg2izZu4XL8';
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `New Video Uploaded! https://www.youtube.com/watch?v=${key}`,
        }),
    });
}

// const payload: DownloadAndUploadVideoRequest = {
// 	sources: [
// 		{
// 			url: "https://www.youtube.com/live/_RwQbNrR26U",
//             highlights: [
//                 {
//                     start: "17:46",
//                     end: "18:19"
//                 },
//                 {
//                     start: "25:52",
//                     end: "27:11"
//                 }
//             ]
// 		},
// 		{
// 			url: "https://www.youtube.com/live/_RwQbNrR26U",
//             highlights: [
//                 {
//                     start: "7:42",
//                     end: "8:07"
//                 }
//             ]
// 		},
// 	],
//     concat: true,
// 	// youtube: {
// 	// 	title: "Hollow Knight - The Hollow Knight + The Radiance (Dream No More Ending)",
// 	// 	privacyStatus: "public"
// 	// }
// };
const payload: DownloadAndUploadVideoRequest = {
	sources: [
		{
			url: "https://www.youtube.com/live/ZYfaKv7eqF0",
            highlights: [
                {
                    start: "12:36",
                    end: "15:00"
                }
                // {
                //     start: "0:28",
                //     end: "17:17"
                // }
            ],
            // customFormat: "bestvideo[height=144]+bestaudio/best[height=144]"
		},
	],
    // concat: true,
	// youtube: {
	// 	title: "Hollow Knight - Sister of Battle (Radiant + Nail Only)",
	// 	privacyStatus: "public"
	// }
};
const duv = new DownloadAndUploadVideoScript(config);
duv.do(payload).then(console.log);
