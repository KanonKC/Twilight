import { Model } from "sequelize";
import { getTwitchVideoData } from "../downloads/platforms/get-twitch-video-data";
import { prisma } from "../../prisma";
import { DownloadedVideo } from "@prisma/client";

const prefixPath = process.env.VIDEO_STORAGE_PATH || "";

export async function getVaultVideo(
	url: string
): Promise<DownloadedVideo | null> {
	if (url.startsWith("https://")) {
		if (url.includes("youtube")) {
			const prefixId = url.split("v=")[1];
			return prisma.downloadedVideo.findFirst({
				where: {
					platform: "Youtube",
					platformId: prefixId,
				},
			});
		} else if (url.includes("twitch")) {
			const data = await getTwitchVideoData(url);
			return prisma.downloadedVideo.findFirst({
				where: {
					platform: "Twitch",
					platformId: data.id,
				},
			});
		}
	} else {
		let video = await prisma.downloadedVideo.findFirst({
			where: {
				filename: url,
			},
		});

		if (!video) {
			video = await prisma.downloadedVideo.findFirst({
				where: {
					filename: url.slice(prefixPath.length + 1),
				},
			});
		}

		return video;
	}

    return null
}
