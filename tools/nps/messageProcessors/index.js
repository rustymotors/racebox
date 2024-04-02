import { processUserLogin } from "./processUserLogin.js";
import { processGetProfileMaps } from "./processGetProfileMaps.js";
import { processCheckProfileName } from "./processCheckProfileName.js";
import { processCheckPlateText } from "./processCheckPlateText.js";
import { processCreateProfile } from "./processCreateProfile.js";
import { processDeleteProfile } from "./processDeleteProfile.js";
import { processGetProfileInfo } from "./processGetProfileInfo.js";
import { processGameLogin } from "./processGameLogin.js";
import { processLobbyLogin } from "./processLobbyLogin.js";
import { processFirstBuddy } from "./processGetFirstBuddy.js";
import { processEncryptedGameCommand } from "./processEncryptedGameCommand.js";
import { processPing } from "./processPing.js";
export class MessageProcessorError extends Error {
    constructor(id, message) {
        super(`MessageProcessorError: ${id}: ${message}`);
    }
}
export const gameMessageProcessors = new Map([]);
export function populateGameMessageProcessors(processors) {
    processors.set(0x100, processLobbyLogin);
    processors.set(535, processPing); // 0x217
    processors.set(0x501, processUserLogin);
    processors.set(0x503, processGameLogin);
    processors.set(0x507, processCreateProfile);
    processors.set(0x50b, processFirstBuddy);
    processors.set(0x512, processDeleteProfile);
    processors.set(0x519, processGetProfileInfo);
    processors.set(0x532, processGetProfileMaps);
    processors.set(0x533, processCheckProfileName);
    processors.set(0x534, processCheckPlateText);
    processors.set(4353, processEncryptedGameCommand); // 0x1101
}
export function getGameMessageProcessor(messageId) {
    if (gameMessageProcessors.has(messageId) === true) {
        // @ts-expect-error - Since has() is true, the return value is NOT undefined
        return gameMessageProcessors.get(messageId);
    }
    throw new MessageProcessorError(messageId, "No message processor found");
}
export class PortMapError extends Error {
    port;
    constructor(port, message) {
        super(message);
        this.name = "PortMapError";
        this.port = port;
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
export const portToMessageTypes = new Map([]);
export function populatePortToMessageTypes(portMap) {
    portMap.set(7003, "Game");
    portMap.set(8226, "Game");
    portMap.set(8228, "Game");
    portMap.set(43300, "Server");
}
export function getPortMessageType(port) {
    if (portToMessageTypes.has(port) === true) {
        // @ts-expect-error - Since has() is true, the return value is NOT undefined
        return portToMessageTypes.get(port);
    }
    throw new PortMapError(port, "No message type found");
}
