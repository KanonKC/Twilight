import { downloadRange } from "../services/download-range";

export async function downloadVideoAPI(url: string) {
    const downloadVideoModel = await downloadRange(url)
    const video = downloadVideoModel.dataValues
    return { url, video }
}