export function generateRandomString(length:number):string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function escapeUnicode(str: string) {
    return str.replace(/[^\0-~]/g, function(ch: string) {
        return "\\u" + ("0000" + ch.charCodeAt(0).toString(16)).slice(-4);
    });
}