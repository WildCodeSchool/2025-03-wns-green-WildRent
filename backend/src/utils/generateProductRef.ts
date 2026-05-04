import crypto from "crypto";

export function generateProductRef(length: number = 8): string {
    const prefix = "WR-";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const array = new Uint8Array(length);

    crypto.getRandomValues(array);

    const randomPart = Array.from(array)
        .map((x) => chars[x % chars.length])
        .join("");

    return `${prefix}${randomPart}`;
}
