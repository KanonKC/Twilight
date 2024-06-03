import { DownloadVideoModel } from "../models/models";

DownloadVideoModel.destroy({
    where: {},
    cascade: true
}).then(() => {
    console.log('All videos removed');
})