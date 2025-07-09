import { exec } from "child_process";

export async function getScreenDetection(filename: string): Promise<number[]> {
	return new Promise((resolve, reject) => {
		exec(
			`ffmpeg -i ${filename} -filter:v "select='gt(scene,0.3)',showinfo" -f null -`,
			(error, stdout, stderr) => {
				const result = JSON.parse(stdout);
				resolve(result);
			}
		);
	});
}
