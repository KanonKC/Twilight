import Python from "../../externals/python/python";

const python = new Python()
python.youtubeUpload("dumps/test-video.mp4",{
    title: "Test",
    description: "This is a description",
    privacyStatus: "unlisted"
}).then(console.log)