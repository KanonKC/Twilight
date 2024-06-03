export function getYoutubeVideoKey(url:string):string {

    /* 
    Possible Youtube URL formats:
    - https://www.youtube.com/watch?v=videoId
    - https://www.youtube.com/live/videoId
    - https://youtu.be/videoId?list=playlistId
    */

    if (url.includes("v=")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get("v") as string;
    }
    else if (url.includes("live/")) {
        return url.split("live/")[1];
    }
    else if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1].split("?")[0];
    }
    else {
        return url
    }
}