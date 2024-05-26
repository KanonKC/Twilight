"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_info_1 = require("../services/twitch-info");
(0, twitch_info_1.getTwitchVideoInfo)("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
    console.log("-------------------------");
    console.log(video);
    console.log("-------------------------");
});
