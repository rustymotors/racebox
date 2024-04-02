import { putLenString } from "../utils/purePut.js";
import { getAsHex, getLenBlob, getLenString, getShortBool, } from "../utils/pureGet.js";
export class GameProfile {
    customerId; // 4 bytes
    profileName; // 32 bytes - max length
    serverId; // 4 bytes
    createStamp; // 4 bytes
    lastLoginStamp; // 4 bytes
    numberGames; // 4 bytes
    profileId; // 4 bytes
    isOnline; // 2 bytes
    gamePurchaseStamp; // 4 bytes
    gameSerialNumber; // 32 bytes - max length
    timeOnline; // 4 bytes
    timeInGame; // 4 bytes
    gameBlob; // 512 bytes - max length
    personalBlob; // 256 bytes - max length
    pictureBlob; // 1 byte
    dnd; // 2 bytes
    gameStartStamp; // 4 bytes
    currentKey; // 400 bytes - max length
    profileLevel; // 2 bytes
    shardId; // 4 bytes
    constructor() {
        this.customerId = 0;
        this.profileName = "";
        this.serverId = 0;
        this.createStamp = 0;
        this.lastLoginStamp = 0;
        this.numberGames = 0;
        this.profileId = 0;
        this.isOnline = false;
        this.gamePurchaseStamp = 0;
        this.gameSerialNumber = "";
        this.timeOnline = 0;
        this.timeInGame = 0;
        this.gameBlob = Buffer.alloc(0);
        this.personalBlob = Buffer.alloc(0);
        this.pictureBlob = Buffer.alloc(0);
        this.dnd = false;
        this.gameStartStamp = 0;
        this.currentKey = "";
        this.profileLevel = 0;
        this.shardId = 0;
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
    static new() {
        return new GameProfile();
    }
    static fromBytes(data, size) {
        const message = new GameProfile();
        let offset = 0;
        message.customerId = data.readUInt32BE(offset);
        offset += 4;
        message.profileName = getLenString(data, offset, false);
        offset += message.profileName.length + 2;
        message.serverId = data.readUInt32BE(offset);
        offset += 4;
        message.createStamp = data.readUInt32BE(offset);
        offset += 4;
        message.lastLoginStamp = data.readUInt32BE(offset);
        offset += 4;
        message.numberGames = data.readUInt32BE(offset);
        offset += 4;
        message.profileId = data.readUInt32BE(offset);
        offset += 4;
        message.isOnline = getShortBool(data, offset);
        offset += 2;
        message.gamePurchaseStamp = data.readUInt32BE(offset);
        offset += 4;
        message.gameSerialNumber = getLenString(data, offset, false);
        offset += message.gameSerialNumber.length + 2;
        message.timeOnline = data.readUInt32BE(offset);
        offset += 4;
        message.timeInGame = data.readUInt32BE(offset);
        offset += 4;
        message.gameBlob = getLenBlob(data, offset, false);
        offset += message.gameBlob.length + 2;
        message.personalBlob = getLenBlob(data, offset, false);
        offset += message.personalBlob.length + 2;
        message.pictureBlob = data.subarray(offset, offset + 1);
        offset += message.pictureBlob.length;
        message.dnd = getShortBool(data, offset);
        offset += 2;
        message.gameStartStamp = data.readUInt32BE(offset);
        offset += 4;
        message.currentKey = getLenString(data, offset, false);
        offset += message.currentKey.length + 2;
        message.profileLevel = data.readUInt16BE(offset);
        offset += 2;
        message.shardId = data.readUInt32BE(offset);
        return message;
    }
    toBytes() {
        const buffer = Buffer.alloc(this.getSize());
        let offset = 0;
        buffer.writeUInt32BE(this.customerId, offset);
        offset += 4; // offset  is now 4
        buffer.writeUInt16BE(3341, offset);
        offset += 2; // offset is now 6
        buffer.writeUInt32BE(this.profileId, offset);
        offset += 4; // offset is now 10
        buffer.writeUInt32BE(this.shardId, offset);
        offset += 4; // offset is now 14
        offset += 2; // offset is now 16
        putLenString(buffer, offset, this.profileName, false);
        // buffer.writeUInt32BE(this.serverId, offset);
        // offset += this.profileName.length + 2;
        // buffer.writeUInt32BE(this.createStamp, offset);
        // offset += 4;
        // buffer.writeUInt32BE(this.lastLoginStamp, offset);
        // offset += 4;
        // buffer.writeUInt32BE(this.numberGames, offset);
        // offset += 4;
        // putShortBool(buffer, offset, this.isOnline);
        // offset += 2;
        // buffer.writeUInt32BE(this.gamePurchaseStamp, offset);
        // offset += 4;
        // putLenString(buffer, offset, this.gameSerialNumber, false);
        // offset += this.gameSerialNumber.length + 2;
        // buffer.writeUInt32BE(this.timeOnline, offset);
        // offset += 4;
        // buffer.writeUInt32BE(this.timeInGame, offset);
        // offset += 4;
        // putLenBlob(buffer, offset, this.gameBlob, false);
        // offset += this.gameBlob.length + 2;
        // putLenBlob(buffer, offset, this.personalBlob, false);
        // offset += this.personalBlob.length + 2;
        // this.pictureBlob.copy(buffer, offset, 0, 1);
        // offset += 1;
        // putShortBool(buffer, offset, this.dnd);
        // offset += 2;
        // buffer.writeUInt32BE(this.gameStartStamp, offset);
        // offset += 4;
        // putLenString(buffer, offset, this.currentKey, false);
        // offset += this.currentKey.length + 2;
        // buffer.writeUInt16BE(this.profileLevel, offset);
        // offset += 2;
        return buffer;
    }
    toString() {
        return `GameProfile: 
        customerID: ${this.customerId}
        profileName: ${this.profileName}
        serverId: ${this.serverId}
        createStamp: ${this.createStamp}
        lastLoginStamp: ${this.lastLoginStamp}
        numberGames: ${this.numberGames}
        profileId: ${this.profileId}
        isOnline: ${this.isOnline}
        gamePurchaseStamp: ${this.gamePurchaseStamp}
        gameSerialNumber: ${this.gameSerialNumber}
        timeOnline: ${this.timeOnline}
        timeInGame: ${this.timeInGame}
        gameBlob: ${this.gameBlob}
        personalBlob: ${this.personalBlob}
        pictureBlob: ${this.pictureBlob}
        dnd: ${this.dnd}
        gameStartStamp: ${this.gameStartStamp}
        currentKey: ${this.currentKey}
        profileLevel: ${this.profileLevel}
        shardId: ${this.shardId}
        `;
    }
    toHex() {
        return getAsHex(this.toBytes());
    }
    setData(data) {
        throw new Error("Method not implemented.");
    }
    getData() {
        throw new Error("Method not implemented.");
    }
    getSize() {
        return 52;
    }
}
