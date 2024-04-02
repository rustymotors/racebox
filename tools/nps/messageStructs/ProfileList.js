import { NPSList } from "./NPSList.js";
export class ProfileList extends NPSList {
    serialize() {
        return this.toBytes();
    }
    deserialize(data) {
        throw new Error("Method not implemented.");
    }
    getByteSize() {
        return this.getSize();
    }
    maxProfiles = 0; // 1 byte
    profiles = [];
    getMaxProfiles() {
        return this.maxProfiles;
    }
    addProfile(profile) {
        this.profiles.push(profile);
        this.maxProfiles = this.profiles.length;
    }
    toBytes() {
        const buffer = Buffer.alloc(this.getSize());
        let offset = 0;
        buffer.writeUInt16BE(this.maxProfiles, offset);
        offset += 2;
        for (const profile of this.profiles) {
            const profileBuffer = profile.toBytes();
            profileBuffer.copy(buffer, offset);
            offset += profile.getSize();
        }
        return buffer;
    }
    toString() {
        return `ProfileList(maxProfiles=${this.maxProfiles}, profiles=${this.profiles})`;
    }
    toHex() {
        throw new Error("Method not implemented.");
    }
    setData(data) {
        throw new Error("Method not implemented.");
    }
    getData() {
        throw new Error("Method not implemented.");
    }
    getSize() {
        let size = 4;
        for (const profile of this.profiles) {
            size += profile.getSize();
        }
        return size;
    }
}
