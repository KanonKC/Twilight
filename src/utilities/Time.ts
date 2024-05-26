export function convertHHMMSSStringToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    console.log(time,hours * 3600 + minutes * 60 + seconds)
    return hours * 3600 + minutes * 60 + seconds;
}