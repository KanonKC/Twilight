export function includeAll(text:string, keywords:string[]):boolean {
    for (const keyword of keywords) {
        if (!text.includes(keyword)) {
            return false
        }
    }
    return true
}