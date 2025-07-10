import { exec } from "child_process";

interface GetAudioSpikeOptions {
    threshold?: number;
}

export async function getAudioSpike(filename: string, options?: GetAudioSpikeOptions): Promise<number[]> {
    const defaultThreshold = 0.6
	return new Promise((resolve, reject) => {
		exec(
			`python src/modules/audio-spike.py ${filename} ${options?.threshold ?? defaultThreshold}`,
			(error, stdout, stderr) => {
				const result = JSON.parse(stdout);
				resolve(result);
			}
		);
	});
}
