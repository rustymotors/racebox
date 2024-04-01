import { OldServerMessage } from "rm-shared";
import { trackingPing } from "../src/trackingPing.js";
import { describe, test, expect, vi } from "vitest";

describe("trackingPing", () => {
  test("does not return a message", async () => {
    // arrange
    const inboundMessage = new OldServerMessage();

    vi.mock("rm-shared", async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import("rm-shared")>()),
      };
    });
    const mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
    };

    // act
    const { messages } = await trackingPing({
      connectionId: "test",
      packet: inboundMessage,
      log: mockLogger,
    });
    expect(messages.length).toBe(0);
  });
});
