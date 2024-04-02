import type { PersonaRecord } from "../src/PersonaRecord.js";
import { personaRecords } from "./internal.js";

/**
 *
 * @param {number} id
 * @return {Promise<PersonaRecord[]>}
 */

export async function getPersonasByPersonaId({
    personas = personaRecords,
    id,
}: {
    personas?: PersonaRecord[];
    id: number;
}): Promise<PersonaRecord[]> {
    const results = personas.filter((persona) => {
        const match = id === persona.personaId;
        return match;
    });
    if (results.length === 0) {
        const err = new Error(`Unable to locate a persona for id: ${id}`);
        throw err;
    }

    return results;
}
