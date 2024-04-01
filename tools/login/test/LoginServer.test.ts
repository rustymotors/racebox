import { describe, it, expect, vi } from "vitest";
import { LoginServer } from "../src/index.js";
import { TServerLogger } from "rm-shared";

describe("LoginServer", () => {
    describe("constructor", () => {
        it("should create a new instance", () => {
            const log: TServerLogger = {
                debug: vi.fn(),
                error: vi.fn(),
                info: vi.fn(),
                warn: vi.fn(),
                fatal: vi.fn(),
                trace: vi.fn(),
            };
            const loginServer = new LoginServer({
                log,
            });
            expect(loginServer).toBeDefined();
        });
    });
});
