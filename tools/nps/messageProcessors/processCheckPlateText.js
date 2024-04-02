import { GameMessage } from "../messageStructs/GameMessage.js";
import { getLenString } from "../utils/pureGet.js";
import { getUserSessionByConnectionId, setUserSession, } from "../services/session.js";
import { getServerLogger } from "rm-shared";
const log = getServerLogger();
export async function processCheckPlateText(connectionId, message, socketCallback) {
    // This message is only called by debug, so let's sey the clinet version to debug
    const session = await getUserSessionByConnectionId(connectionId);
    if (session) {
        log.info(`Setting client version to debug for ${session.customerId}`);
        session.clientVersion = "debug";
        setUserSession(session);
    }
    const plateType = message.getDataAsBuffer().readUInt32BE(0);
    const requestedPlateText = getLenString(message.getDataAsBuffer(), 4, false);
    log.info(`Requested plate text: ${requestedPlateText} for plate type ${plateType}`);
    const response = new GameMessage(0);
    response.header.setId(0x207);
    const responseBytes = response.serialize();
    socketCallback([responseBytes]);
}
