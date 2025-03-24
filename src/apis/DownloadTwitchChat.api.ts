import { writeFileSync } from "fs";
import { getTwitchVideoChat } from "../services/downloads/platforms/get-twitch-video-chat";
import { getTwitchVideoKey } from "../utilities/Url";
import { convertSecondsToHHMMSSString } from "../utilities/Time";

export async function downloadTwitchChat(url: string) {
    
    const currentTs = Date.now();
    const videoKey = getTwitchVideoKey(url);
	const data = await getTwitchVideoChat(url);
    const filename = `dumps/twitch-chat/${videoKey}_${currentTs}_chat`

	writeFileSync(`${filename}.json`, JSON.stringify(data, null, 2));
	writeFileSync(
		`${filename}.txt`,
		data
			.map(
				(chat) =>
					`${convertSecondsToHHMMSSString(chat.contentOffsetSeconds)} ${
						chat.commenter.displayName
					}: ${chat.message.fragments
						.map((fragment) => fragment.text)
						.join("")}`
			)
			.join("\n")
	);

    const currentDir = process.cwd();

    return {
        json: `${currentDir}/${filename}.json`,
        txt: `${currentDir}/${filename}.txt`
    };
}