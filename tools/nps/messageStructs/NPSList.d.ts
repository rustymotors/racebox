/// <reference types="node" resolution-mode="require"/>
import type { ISerializable } from "../types.js";
export declare class NPSList implements ISerializable {
    serialize(): Buffer;
    deserialize(data: Buffer): void;
    getByteSize(): number;
    private list;
    toBytes(): Buffer;
    toString(): string;
    toHex(): string;
    setData(data: Buffer): void;
    getData(): Buffer;
    getSize(): number;
}
