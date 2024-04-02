import { getAsHex } from "../utils/pureGet.js";
export class UserAction {
    name;
    data = Buffer.alloc(0);
    constructor(name, bytes) {
        this.name = name;
        if (bytes) {
            this.data = bytes;
        }
    }
    serialize() {
        throw new Error("Method not implemented.");
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        throw new Error("Method not implemented.");
    }
    setData(data) {
        throw new Error("Method not implemented.");
    }
    getData() {
        throw new Error("Method not implemented.");
    }
    static fromBytes(name, bytes) {
        return new UserAction(name, bytes);
    }
    toBytes() {
        return Buffer.from(this.name, "utf8");
    }
    toString() {
        return this.name;
    }
    toHex() {
        return getAsHex(this.toBytes());
    }
    getSize() {
        return this.name.length;
    }
}
