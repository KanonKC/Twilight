import { downloadRange } from "../../../services/downloads";
import { videoTrim } from "../../../services/videos/video-trim";

const filename = "dumps/youtube_X1JQl3m8b4w_gIKV.mp4";
const start = "02:37:15";
const end = "02:37:50";

const highlights = [
    640.3599092970521,  943.0552380952381,
    1076.477097505669, 1236.4625850340135,
   1354.7218140589569, 1538.8560544217687,
   1938.2392743764171,  4933.613424036281,
    6507.369070294784,  8185.637732426304,
    8414.168526077097,  8744.565260770974,
    9659.338594104309,  9734.339047619047,
   10903.138684807256, 10992.047891156462,
   11501.215056689342, 11615.735873015872,
   11824.576145124716, 12326.475464852607
]

const timeRanges = highlights.map((highlight, index) => ({
    start: Math.floor(highlight)-15,
    end: Math.floor(highlight)+15,
}))


async function testVideoTrim() {
	const video = await downloadRange(filename);
	videoTrim(video, start, end).then((result) => {
		console.log(result);
	});
}

testVideoTrim();
