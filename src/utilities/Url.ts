export function getYoutubeVideoKey(url:string):string {
    if (url.includes("v=")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get("v") as string;
    }
    else if (url.includes("live/")) {
        return url.split("live/")[1];
    }
    else {
        throw new Error("Invalid Youtube URL");
    }
}