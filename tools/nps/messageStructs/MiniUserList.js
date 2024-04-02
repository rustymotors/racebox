import { putLenString } from "../utils/purePut.js";
export class MiniUserInfo {
    userId; // 4 bytes
    userName; // 32 bytes - max length
    constructor(userId, userName) {
        if (userName.length > 32) {
            throw new Error(`User name too long: ${userName}`);
        }
        this.userId = userId;
        this.userName = userName;
    }
    serialize() {
        const buffer = Buffer.alloc(this.getByteSize());
        let offset = 0;
        buffer.writeUInt32BE(this.userId, offset);
        offset += 4;
        putLenString(buffer, offset, this.userName, false);
        return buffer;
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        return 4 + 4 + this.userName.length + 1;
    }
    toString() {
        return `MiniUserInfo(userId=${this.userId}, userName=${this.userName})`;
    }
}
export class MiniUserList {
    channelId; // 4 bytes
    channelUsers = [];
    constructor(channelId) {
        this.channelId = channelId;
    }
    addChannelUser(user) {
        this.channelUsers.push(user);
    }
    serialize() {
        const buffer = Buffer.alloc(this.getByteSize());
        let offset = 0;
        buffer.writeUInt32BE(this.channelId, offset);
        offset += 4;
        buffer.writeUInt32BE(this.channelUsers.length, offset);
        offset += 4;
        this.channelUsers.forEach((user) => {
            const userBuffer = user.serialize();
            userBuffer.copy(buffer, offset);
            offset += userBuffer.length;
        });
        return buffer;
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        return (16 +
            this.channelUsers.reduce((acc, user) => acc + user.getByteSize(), 0));
    }
    toString() {
        return `MiniUserList(channelId=${this.channelId}, channelUsers=${this.channelUsers})`;
    }
}
