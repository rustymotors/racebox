import { putLenString } from "../utils/purePut.js";
import { NPSList } from "./NPSList.js";
import { getServerLogger } from "rm-shared";
const log = getServerLogger();
const channelRecordSize = 40;
export class MiniRiffInfo {
  riffName; // 32 bytes - max length
  riffId; // 4 bytes
  population; // 2 bytes
  constructor(riffName, riffId, population) {
    if (riffName.length > 32) {
      throw new Error(`Riff name too long: ${riffName}`);
    }
    this.riffName = riffName;
    this.riffId = riffId;
    this.population = population;
  }
  serialize() {
    const buffer = Buffer.alloc(this.getByteSize());
    let offset = 0;
    putLenString(buffer, offset, this.riffName, false);
    offset += 2 + this.riffName.length + 1;
    buffer.writeUInt32BE(this.riffId, offset);
    offset += 4;
    buffer.writeUInt16BE(this.population, offset);
    log.debug(`MiniRiffInfo: ${this.toString()} - ${buffer.toString("hex")}`);
    return buffer;
  }
  deserialize(data) {
    throw new Error("Method not implemented.");
  }
  getByteSize() {
    return 4 + this.riffName.length + 1 + 4 + 2;
  }
  toString() {
    return `MiniRiffInfo(riffName=${this.riffName}, riffId=${this.riffId}, population=${this.population})`;
  }
}
export class MiniRiffList extends NPSList {
  serialize() {
    return this.toBytes();
  }
  deserialize(data) {
    throw new Error("Method not implemented.");
  }
  getByteSize() {
    return this.getSize();
  }
  riffs = [];
  getMaxRiffs() {
    return this.riffs.length;
  }
  addRiff(riff) {
    this.riffs.push(riff);
  }
  toBytes() {
    const buffer = Buffer.alloc(this.getSize());
    let offset = 0;
    buffer.writeUInt32BE(this.riffs.length, offset);
    offset += 4;
    for (const riff of this.riffs) {
      const riffBuffer = riff.serialize();
      riffBuffer.copy(buffer, offset);
      offset += riff.getByteSize();
    }
    log.debug(`MiniRiffList: ${this.toString()} - ${buffer.toString("hex")}`);
    return buffer;
  }
  toString() {
    return `MiniRiffList(riffs=${this.riffs})`;
  }
  toHex() {
    return this.toBytes().toString("hex");
  }
  getSize() {
    let size = 4;
    for (const riff of this.riffs) {
      size += riff.getByteSize();
    }
    return size;
  }
}
