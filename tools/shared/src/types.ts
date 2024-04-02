import { Server, Socket } from "node:net";
import { serverHeader } from "./messageFactory.js";
import { TConfiguration } from "./Configuration.js";

export interface ServerMessageType {
    _header: serverHeader;
    _msgNo: number;
    size(): number;
    _doDeserialize(buffer: Buffer): ServerMessageType;
    serialize(): Buffer;
    setBuffer(buffer: Buffer): void;
    updateMsgNo(): void;
    toString(): string;
    data: Buffer;
}

export type TServerLogger = {
    info: (message: string) => void;
    error: (message: string) => void;
    fatal: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
    trace: (message: string) => void;
};

export interface IGatewayServer {
    start(): void;
    stop(): void;
    config: TConfiguration;
    log: TServerLogger;
    timer: ReturnType<typeof setTimeout> | null;
    loopInterval: number;
    status: string;
    consoleEvents: string[];
    backlogAllowedCount: number;
    listeningPortList: number[];
    servers: Server[];
}
