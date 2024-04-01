import { describe, it, expect, vi } from "vitest";
import { fetchSessionKeyByConnectionId, fetchSessionKeyByCustomerId, updateUser } from "../src/DatabaseManager.js";

describe("Database", () => {
    describe("fetchSessionKeyByCustomerId", () => {
        it("throws when session key is not found", async () => {
            // arrange

            const log = {
                info: vi.fn(),
                error: vi.fn(),
                fatal: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
                trace: vi.fn(),
            }
            const customerId = 1234;
            // act
            try {
                await fetchSessionKeyByCustomerId(customerId);
            } catch (error) {
                // assert
                expect(error).toEqual(
                    new Error(
                        `Session key not found for customer ${customerId}`,
                    ),
                );
            }
        });
    });

    describe("fetchSessionKeyByConnectionId", () => {
        it("throws when session key is not found", async () => {
            // arrange

            const log = {
                info: vi.fn(),
                error: vi.fn(),
                fatal: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
                trace: vi.fn(),
            }
            const connectionId = "1234";
            // act
            try {
                await fetchSessionKeyByConnectionId(connectionId);
            } catch (error) {
                // assert
                expect(error).toEqual(
                    new Error(
                        `Session key not found for connection ${connectionId}`,
                    ),
                );
            }
        });
    });

    describe("updateUser", () => {
        it("returns successfully when passed a valid user record", async () => {
            // arrange

            const log = {
                info: vi.fn(),
                error: vi.fn(),
                fatal: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
                trace: vi.fn(),
            }
            const userRecord = {
                contextId: "1234",
                customerId: 1234,
                userId: 1234,
                userData: Buffer.from("1234"),
            };
            // act + assert
            expect(() => {
                updateUser(userRecord);
            }).not.toThrow();
        });
    });
});
