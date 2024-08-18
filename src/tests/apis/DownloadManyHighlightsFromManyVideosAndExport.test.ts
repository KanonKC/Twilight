import { downloadManyHighlightsFromManyVideosAndExportAPI } from "../../apis/DownloadManyHighlightsFromManyVideosAndExport.api";

downloadManyHighlightsFromManyVideosAndExportAPI({
    sources: []
}).then((response) => {
    console.log(response)
})