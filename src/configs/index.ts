import { configDotenv } from "dotenv";

export interface Config {
    VideoStoragePath: string;
    Port: number;
    TwitchClientId: string;
    Google: {
        ClientId: string;
        ClientSecret: string;
        RedirectUrl: string;
    }
}

configDotenv();

const config: Config = {
    VideoStoragePath: process.env.VIDEO_STORAGE_PATH || "",
    Port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    TwitchClientId: process.env.TWITCH_CLIENT_ID || "",
    Google: {
        ClientId: process.env.GOOGLE_CLIENT_ID || "",
        ClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        RedirectUrl: process.env.GOOGLE_REDIRECT_URL || "",
    }
}

export default config;