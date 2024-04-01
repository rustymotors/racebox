import { describe, it, expect, vi } from "vitest";
import { _getCompleteVehicleInfo } from "./_getCompleteVehicleInfo.js";
import { ServerMessageType } from "rm-shared";
import { serverHeader } from "rm-shared";

describe("_getCompleteVehicleInfo", () => {
    it("should throw when passed message is too small", async () => {
        // Setup
        const connectionId = "testConnectionId";
        const packet: ServerMessageType = {
            _header: new serverHeader,
            _msgNo: 0,
            size: function (): number {
                throw new Error("Function not implemented.");
            },
            _doDeserialize: function (buffer: Buffer): ServerMessageType {
                throw new Error("Function not implemented.");
            },
            serialize: function (): Buffer {
                throw new Error("Function not implemented.");
            },
            setBuffer: function (buffer: Buffer): void {
                throw new Error("Function not implemented.");
            },
            updateMsgNo: function (): void {
                throw new Error("Function not implemented.");
            },
            data: Buffer.from([]),
        };
        const log = {
            info: vi.fn(),
            error: vi.fn(),
            fatal: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
            trace: vi.fn(),
        };

        const expected = {
            vehicleId: 1,
            skinId: 1,
            flags: 1,
            class: 1,
            damageInfo: "damage",
            ownerId: 1,
            parts: [
                {
                    partId: 1,
                    parentPartId: 1,
                    brandedPartId: 1,
                    percentDamage: 1,
                    itemWear: 1,
                    attachmentPointId: 1,
                    ownerId: 1,
                    partName: "part",
                    repairCost: 1,
                    scrapValue: 1,
                },
            ],
        };

        // Exercise
        _getCompleteVehicleInfo({
            connectionId,
            packet,
            log,
        }).catch((error) => {
            // Verify
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(
                `[GenericRequestMsg] Unable to deserialize buffer: `,
            );
        });
    });
});
