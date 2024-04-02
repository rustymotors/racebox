import { fetchSessionKeyByCustomerId } from "rm-database";
import { getPersonasByPersonaId } from "rm-persona";
import { LoginInfoMessage } from "../LoginInfoMessage.js";

import { UserInfoMessage } from "../UserInfoMessage.js";
import {
    createCommandEncryptionPair,
    createDataEncryptionPair,
} from "rm-shared";
import {
    McosEncryption,
    addEncryption,
    fetchStateFromDatabase,
    getEncryption,
    SerializedBuffer,
} from "rm-shared";
import { ServiceArgs } from "../types.js";

/**
 * Convert to zero padded hex
 *
 * @export
 * @param {Buffer} data
 * @return {string}
 */
export function toHex(data: Buffer): string {
    /** @type {string[]} */
    const bytes: string[] = [];
    data.forEach((b: number) => {
        bytes.push(b.toString(16).toUpperCase().padStart(2, "0"));
    });
    return bytes.join("");
}

/**
 * Handle a request to connect to a game server packet
 *
 * @private
 * @param {ServiceArgs} args
 * @returns {Promise<{
 *  connectionId: string,
 * messages: SerializedBuffer[],
 * }>}
 */
export async function _npsRequestGameConnectServer({
    connectionId,
    message,
    log,
}: ServiceArgs): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}> {
    // This is a NPS_LoginInfo packet
    // As a legacy packet, it used the old NPSMessage format
    // of a 4 byte header, followed by a 4 byte length, followed
    // by the data payload.

    const inboundMessage = new LoginInfoMessage();
    inboundMessage.deserialize(message.data);

    log.debug(`LoginInfoMessage: ${inboundMessage.toString()}`);

    const personas = await getPersonasByPersonaId({
        id: inboundMessage._userId,
    });
    if (typeof personas[0] === "undefined") {
        log.error(`No personas found for userId ${inboundMessage._userId}`);
        const err = new Error("No personas found.");
        throw err;
    }

    const { customerId } = personas[0];

    const state = fetchStateFromDatabase();

    const existingEncryption = getEncryption(state, connectionId);

    if (!existingEncryption) {
        // Set the encryption keys on the lobby connection
        const keys = await fetchSessionKeyByCustomerId(customerId).catch(
            (/** @type {unknown} */ error: unknown) => {
                log.error(
                    `Unable to fetch session key for customerId ${customerId.toString()}: ${String(
                        error,
                    )}`,
                );
                throw new Error(
                    `Unable to fetch session key for customerId ${customerId.toString()}: ${String(
                        error,
                    )}`,
                );
            },
        );
        if (keys === undefined) {
            log.error(
                `Error fetching session keys for customerId ${customerId}`,
            );
            throw new Error("Error fetching session keys!");
        }

        // We have the session keys, set them on the connection
        try {
            const newCommandEncryptionPair = createCommandEncryptionPair(
                keys.sessionKey,
            );

            const newDataEncryptionPair = createDataEncryptionPair(
                keys.sessionKey,
            );

            const newEncryption = new McosEncryption({
                connectionId,
                commandEncryptionPair: newCommandEncryptionPair,
                dataEncryptionPair: newDataEncryptionPair,
            });

            addEncryption(state, newEncryption).save();
        } catch (error) {
            log.error(`Error creating encryption: ${error}`);
            throw new Error(`Error creating encryption: ${error}`);
        }
    }

    // We have a session, we are good to go!
    // Send the response packet

    const responsePacket = new UserInfoMessage();
    responsePacket.fromLoginInfoMessage(inboundMessage);

    responsePacket._header.id = 0x120;

    // log the packet
    log.debug(
        `!!! outbound lobby login response packet: ${responsePacket.toString()}`,
    );

    const outboundMessage = new SerializedBuffer();
    outboundMessage._doDeserialize(responsePacket.serialize());

    return {
        connectionId,
        messages: [outboundMessage],
    };
}
