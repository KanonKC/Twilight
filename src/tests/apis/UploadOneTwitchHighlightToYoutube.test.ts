import { UploadOneTwitchHighlightToYoutubeRequest, uploadOneTwitchHighlightToYoutubeAPI } from "../../apis/UploadOneTwitchHighlightToYoutube.api";

const payload:UploadOneTwitchHighlightToYoutubeRequest = {
    url: "https://www.twitch.tv/videos/2174338772",
    highlight: {
        start: "0:45:28", end: "1:00:52"
    },
    videoDetail: {
        title: "เจอตี้พี่เอก (Sohowtf, Maser Gamer, Thomas)",
        privacyStatus: "unlisted",
    }
}

uploadOneTwitchHighlightToYoutubeAPI(payload).then((response) => {
    console.log(response)
})