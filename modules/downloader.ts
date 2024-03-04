import { createWriteStream, readFileSync } from "fs";
import ytdl from 'ytdl-core';

type DownloadData = {
	url: string;
	title: string;
};

const data: DownloadData = JSON.parse(
	readFileSync("dumps/download.json", "utf8")
);

ytdl(data.url, { quality: "highestvideo" }).pipe(
	createWriteStream(`dumps/${data.title}_video.mp4`)
);
ytdl(data.url, { quality: "highestaudio" }).pipe(
	createWriteStream(`dumps/${data.title}_audio.mp3`)
);
