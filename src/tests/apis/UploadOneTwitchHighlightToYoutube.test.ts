import { UploadOneTwitchHighlightToYoutubeRequest, uploadOneTwitchHighlightToYoutubeAPI } from "../../apis/UploadOneTwitchHighlightToYoutube.api";

const payload:UploadOneTwitchHighlightToYoutubeRequest = {
    url: "",
    highlight: {
        start: "", end: ""
    },
    videoDetail: {
        title: "",
    }
}

uploadOneTwitchHighlightToYoutubeAPI(payload).then((response) => {
    console.log(response)
})