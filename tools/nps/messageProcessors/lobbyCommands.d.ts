/// <reference types="node" resolution-mode="require"/>
export type lobbyCommandProcessor = (commandId: number, data: Buffer) => Promise<Buffer>;
export declare const lobbyCommandMap: Map<number, lobbyCommandProcessor>;
