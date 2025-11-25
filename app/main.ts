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

const payload: DownloadAndUploadVideoRequest = {
    sources: [
        {
            url: 'https://youtu.be/YQ_7zwxJezU',
        },
    ],
    youtube: {
    	title: "Test Upload",
    	privacyStatus: "unlisted",
		onUploadSuccess: sendDiscordWebhook
    }
};
const duv = new DownloadAndUploadVideoScript(config);
duv.do(payload).then(console.log);
