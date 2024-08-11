import { downloadRange } from "../services/downloads"

export async function downloadVideoAPI(url: string) {
    const downloadVideoModel = await downloadRange(url)
    const video = downloadVideoModel
    return { url, video }
}