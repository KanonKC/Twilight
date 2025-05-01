import { getAudioSpike } from "../../services/videos/get-audio-spike";

getAudioSpike("test-audio-spike.mp4").then((result) => {
	console.log(result);
});

