import { getAsHex } from "../utils/pureGet.js";
export class SessionKey {
    key;
    timestamp;
    constructor(key, timestamp) {
        this.key = key;
        this.timestamp = timestamp;
    }
    serialize() {
        throw new Error("Method not implemented.");
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        throw new Error("Method not implemented.");
    }
    static fromBytes(bytes) {
        const keyLength = bytes.readUInt16BE(0);
        // Set the data offset
        let dataOffset = 2 + keyLength;
        const key = bytes.subarray(2, dataOffset);
        // Get the timestamp
        const timestamp = bytes.readUInt32BE(dataOffset);
        return new SessionKey(key, timestamp);
    }
    static fromKeyString(key) {
        const keyBuffer = Buffer.from(key, "hex");
        return new SessionKey(keyBuffer, 0);
    }
    getKey() {
        return this.key.toString("hex");
    }
    toString() {
        return `SessionKey(key=${this.getKey()}, timestamp=${this.timestamp})`;
    }
    toHex() {
        return getAsHex(this.toBytes());
    }
    toBytes() {
        const keyLength = this.key.length;
        const timestamp = this.timestamp;
        const buffer = Buffer.alloc(2 + keyLength + 4);
        buffer.writeUInt16BE(keyLength, 0);
        this.key.copy(buffer, 2);
        buffer.writeUInt32BE(timestamp, 2 + keyLength);
        return buffer;
    }
    getSize() {
        return this.key.length + 6;
    }
    getData() {
        throw new Error("Method not implemented.");
    }
    setData(data) {
        throw new Error("Method not implemented.");
    }
}
