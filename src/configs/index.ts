import { configDotenv } from "dotenv";

export interface Config {
    VideoStoragePath: string;
    Port: number;
    TwitchClientId: string;
}

configDotenv();

const config: Config = {
    VideoStoragePath: process.env.VIDEO_STORAGE_PATH || "",
    Port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    TwitchClientId: process.env.TWITCH_CLIENT_ID || "",
}

export default config;