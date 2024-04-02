import { GameMessage } from "../messageStructs/GameMessage.js";
import { getLenString } from "../utils/pureGet.js";
import { getServerLogger } from "rm-shared";
const log = getServerLogger();
export async function processCheckProfileName(connectionId, message, socketCallback) {
    const customerId = message.serialize().readUInt32BE(8);
    const requestedPersonaName = getLenString(message.serialize(), 12, false);
    log.info(`Requested persona name: ${requestedPersonaName} for customer ${customerId}`);
    const response = new GameMessage(0);
    response.header.setId(0x601);
    const responseBytes = response.serialize();
    socketCallback([responseBytes]);
}
