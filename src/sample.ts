import DownloadService, { IDownloadService } from "./services/download/download.service";
import config, { Config } from "./configs";
import DownloadedVideoRepository from "./repositories/download/download.repository";
import FFmpeg from "./externals/ffmpeg/ffmpeg";
import TwitchDl from "./externals/twitch-dl/twitch-dl";
import YtDlp from "./externals/yt-dlp/yt-dlp";
import Python from "./externals/python/python";
import { prisma } from "./prisma";

const downloadRepo = new DownloadedVideoRepository(prisma);
const ffmpeg = new FFmpeg(config);
const ytDlp = new YtDlp();
// const python = new Python();
const twitchDl = new TwitchDl();
const downloadService = new DownloadService(twitchDl, ffmpeg, ytDlp, config, downloadRepo);

(async () => {
    const video = await ytDlp.downloadYoutubeVideo("https://www.youtube.com/watch?v=5fn262FBt5Q&list=RDNACUbbhDdx8&index=2", {
        customFormat: "bestvideo[height=144]+bestaudio/best[height=144]",
    });
    console.log(video);
})()