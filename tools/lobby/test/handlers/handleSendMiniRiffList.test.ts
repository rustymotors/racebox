import { handleSendMiniRiffList } from "../../src/handlers/handleSendMiniRiffList.js";
import { describe, it, expect, vi } from "vitest";
import { LegacyMessage, TServerLogger } from "rm-shared";

describe("handleSendMiniRiffList", () => {
    it("should return a buffer", async () => {
        // arrange
        const incomingMessage = new LegacyMessage();
        const log = {} as TServerLogger;
        const result = await handleSendMiniRiffList({
            connectionId: "test",
            message: incomingMessage,
            log,
        });

        expect(result.message).toBeInstanceOf(LegacyMessage);
    });
});
