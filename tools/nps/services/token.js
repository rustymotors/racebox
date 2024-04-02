import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId.default();
export const activeTokens = new Map([]);
export function generateTokenRecord(customerId) {
    const token = uid.stamp(34);
    return {
        customerId,
        token,
    };
}
export function generateToken(customerId) {
    const tokenRecord = generateTokenRecord(customerId);
    activeTokens.set(tokenRecord.token, tokenRecord);
    return tokenRecord.token;
}
export function isTokenExpired(token) {
    const issuedAt = uid.parseStamp(token).getTime();
    // 30 minutes
    const expirationTime = Date.now() - 1800000;
    if (issuedAt < expirationTime) {
        return true;
    }
    return false;
}
export function getToken(token) {
    if (activeTokens.has(token)) {
        return activeTokens.get(token);
    }
    return undefined;
}
export function deleteToken(token) {
    activeTokens.delete(token);
}
export function deleteExpiredTokens() {
    for (const token of activeTokens.keys()) {
        if (isTokenExpired(token)) {
            deleteToken(token);
        }
    }
}
export function getCustomerId(token) {
    const tokenRecord = getToken(token);
    if (typeof tokenRecord !== "undefined" && !isTokenExpired(token)) {
        return tokenRecord.customerId;
    }
    return undefined;
}
