import { GameMessage } from "../messageStructs/GameMessage.js";
import { getServerLogger } from "rm-shared";
const log = getServerLogger();
export async function processPing(connectionId, message, socketCallback) {
    log.info(`Ping: ${message.toString()}`);
    const response = new GameMessage(0);
    response.header.setId(0x207);
    const responseBytes = response.serialize();
    socketCallback([responseBytes]);
}
