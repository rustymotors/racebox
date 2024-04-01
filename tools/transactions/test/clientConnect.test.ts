import { clientConnect } from "../src/clientConnect.js";
import { describe, it, expect, vi } from "vitest";

import { updateSessionKey } from "rm-database";
import { TClientConnectMessage } from "../src/TClientConnectMessage.js";

describe("clientConnect", () => {
    it("throws when connection is not found", async () => {
        // arrange
        const customerId = 1234;
        const connectionId = "test";
        const sessionKey =
            "1234567890123456123456789012345612345678901234561234567890123456";
        const contextId = "test";
        const incomingMessage = new TClientConnectMessage();
        incomingMessage._customerId = customerId;

        const log = {
            info: vi.fn(),
            error: vi.fn(),
            fatal: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
            trace: vi.fn(),
        };
        await updateSessionKey(customerId, sessionKey, contextId, connectionId);

        // act
        try {
            await clientConnect({
                connectionId,
                packet: incomingMessage,
                log,
            });
        } catch (error) {
            // assert
            expect(error).toEqual(
                new Error(
                    `Encryption not found for connection ${connectionId}`,
                ),
            );
        }
    });
});
