import { createCipheriv, createDecipheriv, } from "node:crypto";
export const encryptionSessions = new Map([]);
export async function setEncryptionSession(encryptionSession) {
    encryptionSessions.set(encryptionSession.connectionId, encryptionSession);
}
export async function getEncryptionSession(connectionId) {
    if (encryptionSessions.has(connectionId)) {
        return encryptionSessions.get(connectionId);
    }
    return undefined;
}
export async function deleteEncryptionSession(connectionId) {
    encryptionSessions.delete(connectionId);
}
export async function newEncryptionSession({ connectionId, customerId, sessionKey, }) {
    const gameCipher = createCipheriv("des-cbc", Buffer.from(sessionKey, "hex"), Buffer.alloc(8));
    gameCipher.setAutoPadding(false);
    const gameDecipher = createDecipheriv("des-cbc", Buffer.from(sessionKey, "hex"), Buffer.alloc(8));
    gameDecipher.setAutoPadding(false);
    const encryptionSession = {
        connectionId,
        customerId,
        sessionKey,
        gameCipher,
        gameDecipher,
    };
    setEncryptionSession(encryptionSession);
    return encryptionSession;
}
export const userSessions = new Map([]);
export async function setUserSession(userSession) {
    userSessions.set(userSession.token, userSession);
}
export async function getUserSession(token) {
    if (userSessions.has(token)) {
        return userSessions.get(token);
    }
    return undefined;
}
export async function deleteUserSession(token) {
    userSessions.delete(token);
}
export async function getUserSessionByConnectionId(connectionId) {
    for (const userSession of userSessions.values()) {
        if (userSession.connectionId === connectionId) {
            return userSession;
        }
    }
    return undefined;
}
export async function getUserSessionByProfileId(profileId) {
    for (const userSession of userSessions.values()) {
        if (userSession.activeProfileId === profileId) {
            return userSession;
        }
    }
    return undefined;
}
export async function getUserSessionByCustomerId(customerId) {
    for (const userSession of userSessions.values()) {
        if (userSession.customerId === customerId) {
            return userSession;
        }
    }
    return undefined;
}
export async function getUserSessionByIPAndPort(ipAddress, port) {
    for (const userSession of userSessions.values()) {
        if (userSession.ipAddress === ipAddress && userSession.port === port) {
            return userSession;
        }
    }
    return undefined;
}
export async function createNewUserSession({ customerId, token, connectionId, port, ipAddress, activeProfileId, nextSequenceNumber, sessionKey, clientVersion, }) {
    const userSession = {
        customerId,
        token,
        connectionId,
        port,
        ipAddress,
        activeProfileId,
        nextSequenceNumber,
        sessionKey,
        clientVersion,
    };
    setUserSession(userSession);
    return userSession;
}
