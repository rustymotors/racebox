import { OldServerMessage } from "rm-shared";
import type { MessageHandlerArgs, MessageHandlerResult } from "../types.js";
import { GenericReplyMessage } from "./GenericReplyMessage.js";
import { PlayerPhysicalMessage } from "./PlayerPhysicalMessage.js";

export async function _updatePlayerPhysical(
    args: MessageHandlerArgs,
): Promise<MessageHandlerResult> {
    const updatePlayerPhysicalMessage = new PlayerPhysicalMessage();
    updatePlayerPhysicalMessage.deserialize(args.packet.serialize());

    // Log the message
    args.log.debug(
        `UpdatePlayerPhysicalMessage: ${updatePlayerPhysicalMessage.toString()}`,
    );

    // TODO: Save the options

    const response = new GenericReplyMessage();
    response.msgNo = 101;
    response.msgReply = 266;

    const responsePacket = new OldServerMessage();
    responsePacket._header.sequence = args.packet._header.sequence;
    responsePacket._header.flags = 8;

    responsePacket.setBuffer(response.serialize());

    return { connectionId: args.connectionId, messages: [responsePacket] };
}
