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