import { videoConcat } from "../../services/videos/video-concat"

videoConcat([
    'twitch_2165090720_qROL.mp4',
    'youtube_5WjlJE5xh1I_range_3_29_04-3_29_41_0UXE.mp4',
    'youtube_5WjlJE5xh1I_range_1_10_8-1_10_38_ifaO.mp4'
], "test-concat").then(response => {
    console.log(response)
})