import {
    getServerLogger,
    LegacyMessage,
    NPSMessage,
    SerializedBuffer,
} from "rm-shared";
import { BuddyCount, BuddyInfoMessage, BuddyList } from "./BuddyInfoMessage.js";

const log = getServerLogger();

export async function _getFirstBuddy({
    connectionId,
    message,
}: {
    connectionId: string;
    message: LegacyMessage;
}): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}> {
    // This message is a versioned nps message
    const incomingMessage = new NPSMessage();
    incomingMessage._doDeserialize(message._doSerialize());

    log.debug(
        `in _getFirstBuddy, incomingMessage: ${incomingMessage
            .serialize()
            .toString("hex")}`,
    );

    // extract the personaId
    const personaId = incomingMessage.data.readUInt32BE(0);

    log.debug(`in _getFirstBuddy, personaId: ${personaId}`);

    // TODO: Here we need to look up the buddies for the personaId

    // First, send the BuddyCount message
    const buddyCountMessage = new BuddyCount();
    buddyCountMessage.buddyCount = 0;

    const outboundMessage1 = new SerializedBuffer();
    outboundMessage1._doDeserialize(buddyCountMessage.serialize());

    const buddyInfoMessage = new BuddyInfoMessage();

    for (const buddy of buddies) {
        const buddyInfo = new BuddyList();
        buddyInfo.buddyName = buddy.buddyName;
        buddyInfo.gameName = buddy.gameName;
        buddyInfo.isBuddy = buddy.isBuddy;
        buddyInfo.isOnline = buddy.isOnline;
        buddyInfo.dnd = buddy.dnd;
        buddyInfo.dnb = buddy.dnb;
        buddyInfo.noEntry = buddy.noEntry;
        buddyInfo.muteWhispers = buddy.muteWhispers;
        buddyInfo.muteChat = buddy.muteChat;

        buddyInfoMessage.add(buddyInfo);
    }

    const outboundMessage = new SerializedBuffer();
    outboundMessage._doDeserialize(buddyInfoMessage.serialize());

    log.debug(
        `in _getFirstBuddy, outboundMessage: ${outboundMessage1.toString()}`,
    );

    return {
        connectionId,
        messages: [outboundMessage1],
    };
}

interface BuddyInfoRecord {
    buddyId: number;
    buddyName: string;
    gameName: string;
    isBuddy: boolean;
    isOnline: boolean;
    dnd: boolean;
    dnb: boolean;
    noEntry: boolean;
    muteWhispers: boolean;
    muteChat: boolean;
}

export const buddies: BuddyInfoRecord[] = [
    {
        buddyId: 2,
        buddyName: "Einstein",
        gameName: "Good Woof",
        isBuddy: true,
        isOnline: true,
        dnd: false,
        dnb: false,
        noEntry: false,
        muteWhispers: false,
        muteChat: false,
    },
    {
        buddyId: 3,
        buddyName: "Marty",
        gameName: "That kid",
        isBuddy: true,
        isOnline: true,
        dnd: false,
        dnb: false,
        noEntry: false,
        muteWhispers: false,
        muteChat: false,
    },
];
