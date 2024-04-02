/// <reference types="node" />
import { LegacyMessage, TConfiguration, TServerLogger } from "rm-shared";

/**
 *
 *
 * @export
 * @typedef {object} NPSMessageValues
 * @property {number} msgNo
 * @property {number} msgVersion
 * @property {number} reserved
 * @property {Buffer} content
 * @property {number} msgLength
 * @property {"sent" | "received"} direction
 * @property {string} serviceName
 */
/**
 *
 * @class NPSUserStatus
 * @property {string} sessionKey
 * @property {string} opCode
 * @property {Buffer} buffer
 */
export declare class NPSUserStatus extends LegacyMessage {
    _config: TConfiguration;
    log: TServerLogger;
    sessionKey: string;
    opCode: number;
    contextId: string;
    buffer: Buffer;
    /**
     *
     * @param {Buffer} packet
     * @param {Configuration} config
     * @param {ServerLogger} log
     */
    constructor(packet: Buffer, config: TConfiguration, log: TServerLogger);
    /**
     * ExtractSessionKeyFromPacket
     *
     * Take 128 bytes
     * They are the utf-8 of the hex bytes that are the key
     *
     * @param {Buffer} rawPacket
     * @return {void}
     */
    extractSessionKeyFromPacket(rawPacket: Buffer): void;
    toJSON(): {
        msgNo: number;
        msgLength: any;
        content: string;
        contextId: string;
        sessionKey: string;
        rawBuffer: string;
    };
    /**
     * @return {string}
     */
    dumpPacket(): string;
}
