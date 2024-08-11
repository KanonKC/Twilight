import { downloadManyHighlightsFromManyVideosAPI } from "../../apis/DownloadManyHighlightsFromManyVideos.api";



downloadManyHighlightsFromManyVideosAPI({
    videos: [
        {
            url: "https://www.youtube.com/watch?v=yJyf8VMj5HE",
            highlights: [
                {
                    start: "0:00",
                    end: "0:10"
                },
                {
                    start: "0:20",
                    end: "0:30"
                }
            ]
        },
        {
            url: "https://www.twitch.tv/videos/2219886235",
            highlights: [
                {
                    start: "0:07",
                    end: "0:10"
                },
                {
                    start: "0:23",
                    end: "0:30"
                }
            ]
        }
    ],
    concatVideo: true,
    concatVideoTitle: "Test many hightlight from many videos"
}).then(response => {
    console.log(response)
})