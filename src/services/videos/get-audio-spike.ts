import { exec } from "child_process";

export async function getAudioSpike(filename: string): Promise<number[]> {
	return new Promise((resolve, reject) => {
		exec(
			`python src/modules/audio-spike.py ${filename}`,
			(error, stdout, stderr) => {
				const result = JSON.parse(stdout);
				resolve(result);
			}
		);
	});
}
