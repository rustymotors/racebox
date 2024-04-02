export class MessageHeader {
    version;
    id;
    length;
    constructor(version, id, length) {
        if (version !== 0 && version !== 257) {
            throw new Error(`Invalid version ${version}`);
        }
        this.version = version;
        this.id = id;
        this.length = length !== 0 ? length : this.getByteSize();
    }
    getDataOffset() {
        return this.getVersion() === 0 ? 4 : 12;
    }
    getByteSize() {
        return this.getVersion() === 0 ? 4 : 12;
    }
    getVersion() {
        return this.version;
    }
    getId() {
        return this.id;
    }
    getLength() {
        return this.length;
    }
    setVersion(version) {
        if (version !== 0 && version !== 257) {
            throw new Error(`Invalid version ${version}`);
        }
        this.version = version;
    }
    setId(id) {
        this.id = id;
    }
    setLength(length) {
        this.length = length;
    }
    serializeV0() {
        const buffer = Buffer.alloc(this.getByteSize());
        buffer.writeUInt16BE(this.id, 0);
        buffer.writeUInt16BE(this.length, 2);
        return buffer;
    }
    serializeV1() {
        const buffer = Buffer.alloc(this.getByteSize());
        buffer.writeUInt16BE(this.id, 0);
        buffer.writeUInt16BE(this.length, 2);
        buffer.writeUInt16BE(this.version, 4);
        buffer.writeUInt16BE(0, 6);
        buffer.writeUInt32BE(this.length, 8);
        return buffer;
    }
    serialize() {
        return this.version === 0 ? this.serializeV0() : this.serializeV1();
    }
    deserializeV0(data) {
        this.id = data.readUInt16BE(0);
        this.length = data.readUInt16BE(2);
    }
    deserializeV1(data) {
        this.id = data.readUInt16BE(0);
        this.length = data.readUInt16BE(2);
        // Skip version
        // Skip padding
        this.length = data.readUInt32BE(8);
    }
    deserialize(data) {
        if (data.length < 4) {
            throw new Error(`Data is too short. Expected at least 4 bytes, got ${data.length} bytes`);
        }
        if (this.version === 0) {
            this.deserializeV0(data);
        }
        else {
            this.deserializeV1(data);
        }
    }
}
export class SerializableData {
    data;
    constructor(requestedSize) {
        this.data = Buffer.alloc(requestedSize);
    }
    serialize() {
        return this.data;
    }
    deserialize(data) {
        if (data.length > this.data.length) {
            throw new Error(`Data is too long. Expected at most ${this.data.length} bytes, got ${data.length} bytes`);
        }
        this.data = data;
    }
    getByteSize() {
        return this.data.length;
    }
    toString() {
        return `EmptyData(length=${this.data.length}, data=${this.data.toString("hex")})`;
    }
}
export class GameMessage {
    header;
    data;
    constructor(version) {
        this.header = new MessageHeader(version, 0, 0);
        this.data = new SerializableData(0);
    }
    getDataAsBuffer() {
        return this.data.serialize();
    }
    /** The message length is the length of the message data, not including the id */
    getByteSize() {
        return this.header.getLength();
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
        this.header.setLength(data.getByteSize() + this.header.getByteSize());
    }
    serialize() {
        const buffer = Buffer.alloc(this.getByteSize());
        const headerData = this.header.serialize();
        headerData.copy(buffer, 0);
        const messageData = this.data.serialize();
        messageData.copy(buffer, this.header.getDataOffset());
        return buffer;
    }
    deserialize(data) {
        if (data.length < this.header.getDataOffset()) {
            throw new Error(`Data is too short. Expected at least ${this.header.getDataOffset()} bytes, got ${data.length} bytes`);
        }
        this.header.deserialize(data);
        const messageData = data.subarray(this.header.getDataOffset());
        // Update the message data to the required size
        this.data = new SerializableData(this.header.getLength());
        this.data.deserialize(messageData.subarray(0, this.header.getLength()));
    }
    toString() {
        return `Id: ${this.header.getId()} 
        Length: ${this.header.getLength()} 
        Data: ${this.data.toString()}`;
    }
    static identifyVersion(data) {
        if (data.length < 6) {
            return 0;
        }
        const version = data.readUInt16BE(4);
        if (version !== 257) {
            return 0;
        }
        return 257;
    }
    static fromGameMessage(version, source) {
        const message = new GameMessage(version);
        message.deserialize(source.serialize());
        return message;
    }
}
