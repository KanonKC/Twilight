import { exec } from "child_process";
import { configDotenv } from "dotenv";
import { getTwitchVideoKey } from "../../../utilities/Url";
import { writeFileSync } from "fs";

configDotenv();
const twitchClientId = process.env.TWITCH_CLIENT_ID;

interface TwitchChatMessageFragment {
    text: string,
    emote: string | null,
    __typename: string
}

interface TwitchChatUserBadge {
    id: string,
    setID: string,
    version: string,
    __typename: string,
}

export interface TwitchChat {
    id: string,
    commenter: {
      id: string,
      login: string,
      displayName: string,
      __typename: string
    },
    contentOffsetSeconds: number,
    createdAt: string,
    message: {
      fragments: TwitchChatMessageFragment[],
      userBadges: TwitchChatUserBadge[],
      userColor: string,
      __typename: string
    },
    __typename: string,
}

export async function getTwitchVideoChat(url: string): Promise<TwitchChat[]> {
	const videoKey = getTwitchVideoKey(url);

    if (!twitchClientId) {
        throw new Error('Twitch Client ID not found')
    }

	return new Promise((resolve, reject) => {
		const command = `python ./src/modules/get-twitch-vod-chat.py ${videoKey} 0`;
		exec(command, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				const data = stdout.split("\n").filter((line) => line !== "").map((line) => JSON.parse(line));
				resolve(data as TwitchChat[]);
			}
		});
	});
}

