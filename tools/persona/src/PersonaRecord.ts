import { serializeString } from "rm-core";
import { IPersonaRecord } from "./types.js";

/**
 *
 * This is type UserGameData
 */

export class PersonaRecord implements IPersonaRecord {
    customerId: number;
    personaName: string;
    serverDataId: number;
    createDate: number;
    lastLogin: number;
    numberOfGames: number;
    personaId: number;
    isOnline: number;
    purchaseTimestamp: number;
    gameSerialNumber: string;
    timeOnline: number;
    timeInGame: number;
    extraData: Buffer;
    personaData: Buffer;
    pictureData: Buffer;
    dnd: number;
    startedPlayingTimestamp: number;
    hashedKey: string;
    personaLevel: number;
    shardId: number;
    constructor() {
        this.customerId = 0;
        this.personaName = "";
        this.serverDataId = 0;
        this.createDate = 0;
        this.lastLogin = 0;
        this.numberOfGames = 0;
        this.personaId = 0;
        this.isOnline = 0;
        this.purchaseTimestamp = 0;
        this.gameSerialNumber = "";
        this.timeOnline = 0;
        this.timeInGame = 0;
        this.extraData = Buffer.alloc(512);
        this.personaData = Buffer.alloc(256);
        this.pictureData = Buffer.alloc(1);
        this.dnd = 0;
        this.startedPlayingTimestamp = 0;
        this.hashedKey = "";
        this.personaLevel = 0;
        this.shardId = 0;
    }

    /**
     *
     * @param {Buffer} buffer
     * @returns {PersonaRecord}
     */
    deserialize(buffer: Buffer): PersonaRecord {
        let offset = 0;
        this.customerId = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.personaName = buffer.toString("utf8", offset, offset + 33); // 33
        offset += 33;
        this.serverDataId = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.createDate = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.lastLogin = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.numberOfGames = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.personaId = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.isOnline = buffer.readUInt16BE(offset); // 2
        offset += 2;
        this.purchaseTimestamp = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.gameSerialNumber = buffer
            .subarray(offset, offset + 33)
            .toString("utf8"); // 33
        offset += 33;
        this.timeOnline = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.timeInGame = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.extraData = buffer.subarray(offset, offset + 512); // 512
        offset += 512;
        this.personaData = buffer.subarray(offset, offset + 256); // 256
        offset += 256;
        this.pictureData = buffer.subarray(offset, offset + 1); // 1
        offset += 1;
        this.dnd = buffer.readUInt16BE(offset); // 2
        offset += 2;
        this.startedPlayingTimestamp = buffer.readUInt32BE(offset); // 4
        offset += 4;
        this.hashedKey = buffer.subarray(offset, offset + 400).toString("utf8"); // 400
        offset += 400;
        this.personaLevel = buffer.readUInt16BE(offset); // 2
        offset += 2;
        this.shardId = buffer.readUInt32BE(offset); // 2

        // Offset 1285
        return this;
    }

    /**
     *
     * @returns {Buffer}
     */
    serialize(): Buffer {
        const buffer = Buffer.alloc(PersonaRecord.size());
        try {
            let offset = 0;
            buffer.writeUInt32BE(this.customerId, offset); // 4 - Unknown if this is correct
            offset += 4; // offset = 4
            buffer.writeUInt16BE(3341, offset); // 2 - unknown if this is correct
            offset += 2; // offset = 6
            buffer.writeUInt32BE(this.personaId, offset); // 4 - Known to be correct
            offset += 4; // offset = 10
            buffer.writeUInt32BE(this.shardId, offset); // 4 - Known to be correct
            offset += 4; // offset = 14

            // We don't know what goes here yet
            offset += 4; // offset = 18
            serializeString(this.personaName).copy(buffer, offset); // 34 - Known to be correct


































            // offset = 52
            // buffer.writeUInt32BE(this.serverDataId, offset); // 4
            // offset += 4; // offset = 56
            // buffer.writeUInt32BE(this.createDate, offset); // 4
            // offset += 4; // offset = 60
            // buffer.writeUInt32BE(this.lastLogin, offset); // 4
            // offset += 4; // offset = 64
            // buffer.writeUInt32BE(this.numberOfGames, offset); // 4 (Max personas))
            // offset += 4; // offset = 68
            // buffer.writeUInt16BE(this.isOnline, offset); // 2
            // offset += 2; // offset = 70
            // buffer.writeUInt32BE(this.purchaseTimestamp, offset); // 4
            // offset += 4; // offset = 74
            // buffer.write(this.gameSerialNumber, offset, 33, "utf8"); // 33
            // offset += 33; // offset = 107
            // buffer.writeUInt32BE(this.timeOnline, offset); // 4
            // offset += 4; // offset = 111
            // buffer.writeUInt32BE(this.timeInGame, offset); // 4
            // offset += 4; // offset = 115
            // this.extraData.copy(buffer, offset, 512); // 512
            // offset += 512; // offset = 627
            // this.personaData.copy(buffer, offset, 256); // 256
            // offset += 256; // offset = 883
            // this.pictureData.copy(buffer, offset, 1); // 1
            // offset += 1; // offset = 884
            // buffer.writeUInt16BE(this.dnd, offset); // 2
            // offset += 2; // offset = 886
            // buffer.writeUInt32BE(this.startedPlayingTimestamp, offset); // 4
            // offset += 4; // offset = 890
            // buffer.write(this.hashedKey, offset, 400, "utf8"); // 400
            // offset += 400; // offset = 1290
            // buffer.writeUInt16BE(this.personaLevel, offset); // 2
            // offset += 2; // offset = 1292
        } catch (error) {
            throw new Error(
                `Error serializing PersonaRecord buffer: ${String(error)}`
            );
        }
        return buffer;
    }

    static size() {
        return 52;
    }

    toJSON() {
        return {
            customerId: this.customerId,
            personaId: this.personaId,
            personaName: this.personaName,
            shardId: this.shardId,
            serverDataId: this.serverDataId,
            // createDate: this.createDate,
            // lastLogin: this.lastLogin,
            // numberOfGames: this.numberOfGames,
            // isOnline: this.isOnline,
            // purchaseTimestamp: this.purchaseTimestamp,
            // gameSerialNumber: this.gameSerialNumber,
            // timeOnline: this.timeOnline,
            // timeInGame: this.timeInGame,
            // extraData: this.extraData,
            // personaData: this.personaData,
            // pictureData: this.pictureData,
            // dnd: this.dnd,
            // startedPlayingTimestamp: this.startedPlayingTimestamp,
            // hashedKey: this.hashedKey,
            // personaLevel: this.personaLevel,
        };
    }

    asJSON() {
        return this.toJSON();
    }

    toString() {
        return `PersonaRecord: ${JSON.stringify(this.toJSON())}`;
    }
}
