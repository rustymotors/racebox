import { getPersonasByPersonaId } from "../src/getPersonasByPersonaId.js";
import { describe, it, expect } from "vitest";
import { PersonaRecord } from "../src/PersonaRecord.js";

describe("getPersonasByPersonaId", () => {
    it("returns a persona", async () => {
        // arrange
        const testPersona = new PersonaRecord();
        testPersona.personaId = 1;
        testPersona.personaName = "test";
        testPersona.customerId = 6767;
        testPersona.shardId = 0;
        
        const id = 1;

        // act
        const result = await getPersonasByPersonaId({
            personas: [testPersona],
            id,
        });

        // assert
        expect(result).toBeInstanceOf(Array);
        if (result[0] === undefined) {
            throw new Error("Expected result[0] to be defined");
        }
        expect(result[0].personaId).toBe(id);
        expect(result[0].personaName).toBe("test");
        expect(result[0].customerId).toBe(6767);
        expect(result[0].shardId).toBe(0);
    });
});
