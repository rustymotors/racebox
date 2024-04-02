import { SessionKey } from "./SessionKey.js";
import { UserAction } from "./UserAction.js";
export class UserStatus {
    customerId;
    personaId;
    isCacheHit;
    ban;
    gag;
    sessionKey;
    constructor(customerId, personaId, isCacheHit, ban, gag, sessionKey) {
        this.customerId = customerId;
        this.personaId = personaId;
        this.isCacheHit = isCacheHit;
        this.ban = ban;
        this.gag = gag;
        this.sessionKey = sessionKey;
    }
    serialize() {
        return this.toBytes();
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        return this.getSize();
    }
    static new() {
        return new UserStatus(0, 0, false, new UserAction("ban"), new UserAction("gag"), new SessionKey(Buffer.alloc(12), 0));
    }
    static fromBytes(bytes) {
        let offset = 0;
        const customerId = bytes.readUInt32BE(offset);
        offset += 4;
        const personaId = bytes.readUInt32BE(offset);
        offset += 4;
        const isCacheHit = bytes.readUInt8(offset) === 1;
        offset += 1;
        const ban = UserAction.fromBytes("ban", bytes.subarray(offset));
        offset += ban.getSize();
        const gag = UserAction.fromBytes("gag", bytes.subarray(offset));
        offset += gag.getSize();
        const sessionKey = SessionKey.fromBytes(bytes.subarray(offset));
        return new UserStatus(customerId, personaId, isCacheHit, ban, gag, sessionKey);
    }
    toBytes() {
        const buffer = Buffer.alloc(this.getSize());
        let offset = 0;
        buffer.writeUInt32BE(this.customerId, offset);
        offset += 4;
        buffer.writeUInt32BE(this.personaId, offset);
        offset += 4;
        buffer.writeUInt8(this.isCacheHit ? 1 : 0, offset);
        offset += 1;
        this.ban.toBytes().copy(buffer, offset);
        offset += this.ban.getSize();
        this.gag.toBytes().copy(buffer, offset);
        offset += this.gag.getSize();
        this.sessionKey.toBytes().copy(buffer, offset);
        offset += this.sessionKey.getSize();
        return buffer;
    }
    getSize() {
        return (14 +
            this.ban.getSize() +
            this.gag.getSize() +
            this.sessionKey.getSize());
    }
    getCustomerId() {
        return this.customerId;
    }
    setCustomerId(customerId) {
        this.customerId = customerId;
    }
    getPersonaId() {
        return this.personaId;
    }
    setPersonaId(personaId) {
        this.personaId = personaId;
    }
    getSessionKey() {
        return this.sessionKey;
    }
    setSessionKey(sessionKey) {
        this.sessionKey = sessionKey;
    }
    setBan(ban) {
        this.ban = ban;
    }
    getGag() {
        return this.gag;
    }
    setGag(gag) {
        this.gag = gag;
    }
    toString() {
        return `UserStatus:
        Customer ID: ${this.customerId}
        Persona ID: ${this.personaId}
        Is Cache Hit: ${this.isCacheHit}
        Ban: ${this.ban.toString()}
        Gag: ${this.gag.toString()}
        Session Key: ${this.sessionKey.toString()}`;
    }
    toHex() {
        return this.toBytes().toString("hex");
    }
    setData(data) {
        throw new Error("Method not implemented.");
    }
}
