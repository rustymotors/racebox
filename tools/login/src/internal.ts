// mcos is a game server, written from scratch, for an old game
// Copyright (C) <2017>  <Drazi Crendraven>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { getServerConfiguration } from "rm-shared";
import { NPSUserStatus } from "./NPSUserStatus.js";
import { updateSessionKey } from "rm-database";
import {
    TServerLogger,
    NPSMessage,
    SerializedBuffer,
    NetworkMessage,
} from "rm-shared";
import { UserRecordMini } from "./types.js";

const userRecords: UserRecordMini[] = [
    {
        contextId: "5213dee3a6bcdb133373b2d4f3b9962758",
        customerId: 0x0012808b,
        userId: 0x00000002,
    },
    {
        contextId: "d316cd2dd6bf870893dfbaaf17f965884e",
        customerId: 0x0054b46c,
        userId: 0x00000001,
    },
];

/**
 * Process a UserLogin packet
 * @private
 * @param {object} args
 * @param {string} args.connectionId
 * @param {SerializedBuffer} args.message
 * @param {ServerLogger} args.log
 * @returns {Promise<{
 *  connectionId: string,
 * messages: SerializedBuffer[],
 * }>}
 */
async function login({
    connectionId,
    message,
    log,
}: {
    connectionId: string;
    message: SerializedBuffer;
    log: TServerLogger;
}): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}> {
    const data = message.serialize();

    log.debug(`Received login packet: ${connectionId}`);

    log.debug("Requesting NPSUserStatus packet");
    const userStatus = new NPSUserStatus(data, getServerConfiguration({}), log);
    log.debug("NPSUserStatus packet creation success");

    log.debug("Requesting Key extraction");
    userStatus.extractSessionKeyFromPacket(data);
    log.debug("Key extraction success");

    const { contextId, sessionKey } = userStatus;

    log.debug(
        `UserStatus object from _userLogin,
      ${JSON.stringify({
          userStatus: userStatus.toJSON(),
      })}`,
    );
    userStatus.dumpPacket();

    // Load the customer record by contextId
    // TODO: #1175 Move customer records from being hard-coded to database records
    const userRecord = userRecords.find((r) => {
        return r.contextId === contextId;
    });

    if (typeof userRecord === "undefined") {
        // We were not able to locate the user's record
        const err = new Error(
            `Unable to locate a user record for the context id: ${contextId}`,
        );
        throw err;
    }

    // Save sessionkey in database under customerId
    log.debug("Preparing to update session key in db");
    await updateSessionKey(
        userRecord.customerId,
        sessionKey ?? "",
        contextId,
        connectionId,
    ).catch((error) => {
        const err = new Error(
            `Unable to update session key in the database: ${String(error)}`,
        );
        throw err;
    });

    log.debug("Session key updated");

    const outboundMessage = new NetworkMessage(0x601);

    const dataBuffer = Buffer.alloc(26);
    let offset = 0;
    dataBuffer.writeInt32BE(userRecord.customerId, offset);
    offset += 4;
    dataBuffer.writeInt32BE(userRecord.userId, offset);
    offset += 4;
    dataBuffer.writeInt8(0, offset); // isCacheHit
    offset += 1;
    dataBuffer.writeInt8(0, offset); // ban
    offset += 1;
    dataBuffer.writeInt8(0, offset); // gag
    offset += 1;
    dataBuffer.write(sessionKey ?? "", offset, 12, "ascii");

    const packetContent = dataBuffer;

    // Set the packet content in the outbound message
    outboundMessage.data = packetContent;

    log.debug("Returning login response");
    log.debug(`Outbound message: ${outboundMessage.asHex()}`);

    const outboundMessage2 = new SerializedBuffer();
    outboundMessage2._doDeserialize(outboundMessage.serialize());

    log.debug(
        `Outbound message 2: ${outboundMessage2.serialize().toString("hex")}`,
    );

    // Update the data buffer
    const response = {
        connectionId,
        messages: [outboundMessage2, outboundMessage2],
    };
    log.debug("Leaving login");
    return response;
}

/**
 * Array of supported message handlers
 *
 * @type {{
 *  opCode: number,
 * name: string,
 * handler: (args: {
 * connectionId: string,
 * message: SerializedBuffer,
 * log: TServerLogger,
 * }) => Promise<{
 * connectionId: string,
 * messages: SerializedBuffer[],
 * }>}[]}
 */
export const messageHandlers: {
    opCode: number;
    name: string;
    handler: (args: {
        connectionId: string;
        message: SerializedBuffer;
        log: TServerLogger;
    }) => Promise<{
        connectionId: string;
        messages: SerializedBuffer[];
    }>;
}[] = [
    {
        opCode: 1281, // 0x0501
        name: "UserLogin",
        handler: login,
    },
];

/**
 * Entry and exit point of the Login service
 *
 * @export
 * @param {object} args
 * @param {string} args.connectionId
 * @param {SerializedBuffer} args.message
 * @param {ServerLogger} args.log
 * @returns {Promise<{
 *  connectionId: string,
 * messages: SerializedBuffer[],
 * }>}
 */
export async function handleLoginData({
    connectionId,
    message,
    log,
}: {
    connectionId: string;
    message: SerializedBuffer;
    log: TServerLogger;
}): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}> {
    log.debug(`Received Login Server packet: ${connectionId}`);

    // The packet needs to be an NPSMessage
    const inboundMessage = new NPSMessage();
    inboundMessage._doDeserialize(message.serialize());

    const supportedHandler = messageHandlers.find((h) => {
        return h.opCode === inboundMessage._header.id;
    });

    if (typeof supportedHandler === "undefined") {
        // We do not yet support this message code
        throw new Error(
            `UNSUPPORTED_MESSAGECODE: ${inboundMessage._header.id}`,
        );
    }

    try {
        const result = await supportedHandler.handler({
            connectionId,
            message,
            log,
        });
        log.debug(`Returning with ${result.messages.length} messages`);
        log.debug("Leaving handleLoginData");
        return result;
    } catch (error) {
        throw new Error(`Error handling login data: ${String(error)}`);
    }
}
