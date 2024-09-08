import { downloadAndUploadVideoAPI } from "../../apis/DownloadAndUploadVideo.api";

// downloadAndUploadVideoAPI({
//     sources: [{ url: "https://www.youtube.com/watch?v=v8TuYaELeec" }]
// }).then((response) => {
//     console.log(response)
// })

// downloadAndUploadVideoAPI({
//     sources: [{ url: "https://www.twitch.tv/kanonkc/clip/CharmingTsundereLionWOOP-RMBMHFypKHOa0oDI"}]
// }).then((response) => {
//     console.log(response)
// })

downloadAndUploadVideoAPI({
    sources: [{ url: "https://www.twitch.tv/porjungz/clip/FrigidSecretiveDragonfruitTheThing-_E-XdjP0oDXEjo4g"}]
}).then((response) => {
    console.log(response)
})

downloadAndUploadVideoAPI({
    sources: [{ url: "https://www.youtube.com/watch?v=6o_fCbr9tXE", highlights: [{ start: "11:00", end: "12:15" }] }]
}).then((response) => {
    console.log(response)
})