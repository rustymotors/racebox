import { GameMessage } from "../messageStructs/GameMessage.js";
import type { SocketCallback } from "./index.js";

import { getServerLogger } from "rm-shared";

const log = getServerLogger();

export async function processPing(
    connectionId: string,
    message: GameMessage,
    socketCallback: SocketCallback,
): Promise<void> {
    log.info(`Ping: ${message.toString()}`);

    const response = new GameMessage(0);
    response.header.setId(0x207);

    const responseBytes = response.serialize();

    socketCallback([responseBytes]);
}
