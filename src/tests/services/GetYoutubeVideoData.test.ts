import { getYoutubeVideoData } from "../../services/downloads/platforms/get-youtube-video-data";

getYoutubeVideoData("https://www.youtube.com/watch?v=yJyf8VMj5HE").then((data) => {
    console.log(data);
})
getYoutubeVideoData("https://www.youtube.com/live/5WjlJE5xh1I").then((data) => {
    console.log(data);
})
getYoutubeVideoData("https://www.youtube.com/watch?v=Jgu-lZ0hPyw").then((data) => {
    console.log(data);
})