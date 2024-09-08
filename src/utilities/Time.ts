export function convertHHMMSSStringToSeconds(time: string): number {

    const unitCount = time.split(":").length;

    if (unitCount === 1) {
        let [seconds] = time.split(":").map(Number);
        return seconds;
    }
    else if (unitCount === 2) {
        let [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 + seconds;
    }
    else if (unitCount === 3) {
        let [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }
    else {
        throw new Error("Invalid time format");
    }
}

export function convertSecondsToHHMMSSString(seconds: number): string {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}