import { GenericReply } from "./GenericReplyMessage.js";
import { TClientConnectMessage } from "./TClientConnectMessage.js";
import {
    McosEncryption,
    McosSession,
    addEncryption,
    addSession,
    fetchStateFromDatabase,
    getEncryption,
    OldServerMessage,
    createCommandEncryptionPair,
    createDataEncryptionPair,
} from "rm-shared";
import type { MessageHandlerArgs, MessageHandlerResult } from "../types.js";
import { getUserSessionByCustomerId } from "rm-nps";

/**
 * @param {MessageHandlerArgs} args
 * @return {Promise<MessageHandlerResult>}
 */
export async function clientConnect({
    connectionId,
    packet,
    log,
}: MessageHandlerArgs): Promise<MessageHandlerResult> {
    /**
     * Let's turn it into a ClientConnectMsg
     */
    const newMessage = new TClientConnectMessage();

    newMessage.deserialize(packet.serialize());

    log.debug(`ClientConnectMsg: ${newMessage.toString()}`);

    const customerId = newMessage._customerId;
    if (typeof customerId !== "number") {
        throw new TypeError(
            `customerId is wrong type. Expected 'number', got ${typeof customerId}`,
        );
    }

    const state = fetchStateFromDatabase();

    const existingEncryption = getEncryption(state, connectionId);

    if (existingEncryption) {
        log.debug("Encryption already exists for this connection");
        return { connectionId, messages: [] };
    }

    let result;

    log.debug(`Looking up the session key for ${customerId}...`);

    const userSession = await getUserSessionByCustomerId(customerId);

    if (typeof userSession === "undefined") {
        log.warn(`No user session found for ${customerId}`);
        const errMessage = new GenericReply();
        errMessage.msgNo = 136;
        errMessage.msgReply = packet._msgNo;
        errMessage.result = 309;

        const errPacket = new OldServerMessage();
        errPacket.setBuffer(errMessage.serialize());
        errPacket._header.sequence = packet._header.sequence;

        return { connectionId, messages: [errPacket] };
    }

    const newCommandEncryptionPair = createCommandEncryptionPair(
        userSession.sessionKey,
    );

    const newDataEncryptionPair = createDataEncryptionPair(
        userSession.sessionKey,
    );

    const newEncryption = new McosEncryption({
        connectionId,
        commandEncryptionPair: newCommandEncryptionPair,
        dataEncryptionPair: newDataEncryptionPair,
    });

    const updatedState = addEncryption(state, newEncryption);

    const session = new McosSession({
        connectionId,
        gameId: newMessage._personaId,
    });

    addSession(updatedState, session).save();

    const personaId = newMessage._personaId;

    const personaName = newMessage._personaName;

    log.debug(`cust: ${customerId} ID: ${personaId} Name: ${personaName}`);

    // Create new response packet
    const pReply = new GenericReply();
    pReply.msgNo = 101;
    pReply.msgReply = newMessage._msgNo;

    const responsePacket = new OldServerMessage();
    responsePacket.setBuffer(pReply.serialize());
    responsePacket._header.sequence = packet._header.sequence;

    log.debug(`Response: ${responsePacket.serialize().toString("hex")}`);

    return { connectionId, messages: [responsePacket] };
}
