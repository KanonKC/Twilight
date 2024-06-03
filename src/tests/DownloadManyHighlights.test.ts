import { downloadManyHighlightsAPI } from "../apis/DownloadManyHighlight.api"

downloadManyHighlightsAPI({
    url: "https://www.youtube.com/watch?v=vUy8uGIB03Q",
    highlights: [
        {start: "1:23:10", end: "1:23:30"},
    ]
}).then(response => {
    console.log("Download Completed")
})