"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DownloadManyVideosFromYoutube_1 = require("../controllers/DownloadManyVideosFromYoutube");
(0, DownloadManyVideosFromYoutube_1.downloadManyVideosFromYoutube)({
    "videos": [
        {
            "url": "https://www.youtube.com/live/8A3aB-lc_dA",
            "highlight": [
                { "start": "2:39:55", "end": "2:40:38" },
                { "start": "2:41:00", "end": "2:41:13" },
                { "start": "2:53:09", "end": "2:53:15" },
                { "start": "2:57:43", "end": "2:58:06" }
            ]
        }
    ]
}).then(() => {
    console.log("done");
});
