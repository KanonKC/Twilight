import { createWriteStream, readFileSync } from "fs";
import ytdl from 'ytdl-core';

function secondToByte(second:number) {
	return second * 1000000
}

type DownloadData = {
	url: string;
	title: string;
};

const data: DownloadData = JSON.parse(
	readFileSync("dumps/download.json", "utf8")
);

const videoRange = {start: 1035570, end: 1245285}

ytdl(data.url, { quality: "highestvideo", /* range: videoRange */ }).pipe(
	createWriteStream(`dumps/${data.title}_video.mp4`)
);
ytdl(data.url, { quality: "highestaudio", /* range: videoRange */ }).pipe(
	createWriteStream(`dumps/${data.title}_audio.mp3`)
);
