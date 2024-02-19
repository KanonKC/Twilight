
const fs = require('fs');
const ytdl = require('ytdl-core');

const videoId = fs.readFileSync('dumps/urls.txt', 'utf8');
const filename = fs.readFileSync('dumps/dest.txt', 'utf8');

ytdl(videoId,{quality: 'highestvideo'}).pipe(fs.createWriteStream(`dumps/${filename}_video.mp4`));
ytdl(videoId,{quality: 'highestaudio'}).pipe(fs.createWriteStream(`dumps/${filename}_audio.mp3`));