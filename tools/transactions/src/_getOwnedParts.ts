import { GenericRequestMessage } from "./GenericRequestMessage.js";
import { OldServerMessage } from "rm-shared";
import { PartsAssemblyMessage } from "./PartsAssemblyMessage.js";
import {
    fetchStateFromDatabase,
    findSessionByConnectionId,
} from "rm-shared";
import type { MessageHandlerArgs, MessageHandlerResult } from "../types.js";

export async function _getOwnedParts({
    connectionId,
    packet,
    log,
}: MessageHandlerArgs): Promise<MessageHandlerResult> {
    const getOwnedPartsMessage = new GenericRequestMessage();
    getOwnedPartsMessage.deserialize(packet.data);

    log.debug(`Received Message: ${getOwnedPartsMessage.toString()}`);

    const state = fetchStateFromDatabase();

    const session = findSessionByConnectionId(state, connectionId);

    if (!session) {
        throw new Error("Session not found");
    }

    const ownedPartsMessage = new PartsAssemblyMessage(session.gameId);
    ownedPartsMessage._msgNo = 175;

    const responsePacket = new OldServerMessage();
    responsePacket._header.sequence = packet._header.sequence;
    responsePacket._header.flags = 8;

    responsePacket.setBuffer(ownedPartsMessage.serialize());

    return { connectionId, messages: [responsePacket] };
}
