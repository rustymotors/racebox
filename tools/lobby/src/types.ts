import type { SerializedBuffer, TServerLogger } from "rm-shared";

export interface ServiceArgs {
    connectionId: string;
    message: SerializedBuffer;
    log: TServerLogger;
}

export interface GameMessageOpCode {
    name: string;
    value: number;
    module: "Lobby" | "Login";
}
