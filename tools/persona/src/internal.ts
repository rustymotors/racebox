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

import { TServerLogger, LegacyMessage, SerializedBuffer } from "rm-shared";

import {
    PersonaList,
    PersonaMapsMessage,
} from "./PersonaMapsMessage.js";
import { PersonaRecord } from "./PersonaRecord.js";
import { _selectGamePersona } from "./_selectGamePersona.js";
import { _gameLogout } from "./_gameLogout.js";
import { _getFirstBuddy } from "./_getFirstBuddy.js";
import { validatePersonaName } from "./handlers/validatePersonaName.js";

const NAME_BUFFER_SIZE = 30;

/**
 * Array of supported message handlers
 *
 * @type {{
 *  opCode: number,
 * name: string,
 * handler: (args: {
 * connectionId: string,
 * message: LegacyMessage,
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
        message: LegacyMessage;
        log: TServerLogger;
    }) => Promise<{
        connectionId: string;
        messages: SerializedBuffer[];
    }>;
}[] = [
    {
        opCode: 1283, // 0x503
        name: "Game login",
        handler: _selectGamePersona,
    },
    {
        opCode: 1295, // 0x50F
        name: "Game logout",
        handler: _gameLogout,
    },
    {
        opCode: 1330, // 0x532
        name: "Get persona maps",
        handler: getPersonaMaps,
    },
    {
        opCode: 1331, // 0x533
        name: "Validate persona name",
        handler: validatePersonaName,
    },
    {
        opCode: 1291, // 0x50B
        name: "Get first buddy",
        handler: _getFirstBuddy,
    },
];

/**
 * Return string as buffer
 */
export function generateNameBuffer(name: string, size: number): Buffer {
    const nameBuffer = Buffer.alloc(size);
    Buffer.from(name, "utf8").copy(nameBuffer);
    return nameBuffer;
}

const persona1 = new PersonaRecord();
persona1.customerId = 2868969472;
persona1.personaId = 0x01;
persona1.personaName = "Doc Joe";
persona1.shardId = 0x2c;

const persona2 = new PersonaRecord();
persona2.customerId = 5551212;
persona2.personaId = 0x02;
persona2.personaName = "Dr Brown";
persona2.shardId = 0x2c;


/**
 * All personas
 * NOTE: Currently we only support one persona per customer
 * @type {PersonaRecord[]}
 */
export const personaRecords: PersonaRecord[] =
    [persona1, persona2];

/**
 *
 * @param {number} customerId
//  * @return {Promise<PersonaRecord[]>}
 */
async function getPersonasByCustomerId(
    customerId: number,
): Promise<PersonaRecord[]> {
    const results = personaRecords.filter(
        (persona) => persona.customerId === customerId,
    );
    return results;
}

/**
 * Lookup all personas owned by the customer id
 *
 * TODO: Store in a database, instead of being hard-coded
 *
 * @param {number} customerId
 * @return {Promise<PersonaRecord[]>}
 */
async function getPersonaMapsByCustomerId(
    customerId: number,
): Promise<PersonaRecord[]> {
    switch (customerId) {
        case 5551212:
            return getPersonasByCustomerId(customerId);
        default:
            return [];
    }
}

/**
 * Handle a get persona maps packet
 * @param {object} args
 * @param {string} args.connectionId
 * @param {LegacyMessage} args.message
 * @param {ServerLogger} args.log
 * @returns {Promise<{
 *  connectionId: string,
 * messages: SerializedBuffer[],
 * }>}
 */
async function getPersonaMaps({
    connectionId,
    message,
    log,
}: {
    connectionId: string;
    message: LegacyMessage;
    log: TServerLogger;
}): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}> {
    log.debug("_npsGetPersonaMaps...");

    const requestPacket = message;
    log.debug(
        `NPSMsg request object from _npsGetPersonaMaps ${requestPacket
            ._doSerialize()
            .toString("hex")} `,
    );

    const customerId = requestPacket.data.readUInt32BE(8);

    const personas = await getPersonaMapsByCustomerId(customerId);
    log.debug(`${personas.length} personas found for ${customerId}`);

    const personaMapsMessage = new PersonaMapsMessage();

    // this is a GLDP_PersonaList::GLDP_PersonaList

    try {
        /** @type {PersonaList} */
        let personaList: PersonaList = new PersonaList();

        if (personas.length > 1) {
            log.warn(
                `More than one persona found for customer Id: ${customerId}`,
            );
        }

        personas.forEach((persona) => {
            const personaRecord = new PersonaRecord();

            personaRecord.customerId = persona.customerId;
            personaRecord.personaId = persona.personaId
            personaRecord.personaName = persona.personaName;
            personaRecord.shardId = persona.shardId;
            personaRecord.numberOfGames = personas.length;

            personaList.addPersonaRecord(personaRecord);

            log.debug(
                `Persona record: ${JSON.stringify({
                    personaRecord: personaRecord.toJSON(),
                })}`,
            );
        });

        personaMapsMessage._header.id = 0x607;
        personaMapsMessage._personaRecords = personaList;
        personaMapsMessage.setBuffer(personaList.serialize());
        log.debug(
            `PersonaMapsMessage object from _npsGetPersonaMaps',
            ${JSON.stringify({
                personaMapsMessage: personaMapsMessage
                    .serialize()
                    .toString("hex"),
            })}`,
        );

        const outboundMessage = new SerializedBuffer();
        outboundMessage._doDeserialize(personaMapsMessage.serialize());

        return {
            connectionId,
            messages: [outboundMessage],
        };
    } catch (error) {
        if (error instanceof Error) {
            const err = new Error(
                `Error serializing personaMapsMsg: ${error.message}`,
            );
            throw err;
        }

        const err = new Error(
            "Error serializing personaMapsMsg, error unknonw",
        );
        throw err;
    }
}

/**
 *
 *
 * @param {object} args
 * @param {string} args.connectionId
 * @param {SerializedBuffer} args.message
 * @param {ServerLogger} args.log
 * @returns {Promise<{
 *  connectionId: string,
 * messages: SerializedBuffer[],
 * }>}
 * @throws {Error} Unknown code was received
 */
export async function receivePersonaData({
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
    const { data } = message;
    log.debug(
        `Received Persona packet',
    ${JSON.stringify({
        data: data.toString("hex"),
    })}`,
    );

    // The packet needs to be an NPSMessage
    const inboundMessage = new LegacyMessage();
    inboundMessage._doDeserialize(message.data);

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
            message: inboundMessage,
            log,
        });
        log.debug(`Returning with ${result.messages.length} messages`);
        log.debug("Leaving receivePersonaDatadleData");
        return result;
    } catch (error) {
        throw Error(`Error handling persona data: ${String(error)}`);
    }
}
