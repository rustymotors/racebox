import { greaterThanOrEqual } from "./pureCompare.js";
export function getWord(bytes, offset, isLE) {
    // Get the word at the offset
    return isLE ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
}
export function getDWord(bytes, offset, isLE) {
    // Get the dword at the offset
    return isLE ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
}
/**
 * Get the first n bytes of a buffer.
 * If the buffer is shorter than n bytes, return the whole buffer
 */
export function getNBytes(bytes, n) {
    const bufferLength = bytes.length;
    const cutLength = greaterThanOrEqual(bufferLength, n) ? n : bufferLength;
    // Get the first n bytes
    return bytes.subarray(0, cutLength);
}
export function getAsHex(bytes) {
    return bytes.length % 2 === 0
        ? bytes.toString("hex")
        : bytes.toString("hex") + "0";
}
export function getLenString(bytes, offset, isLE) {
    // Get the length of the string
    const strLen = getWord(bytes, offset, isLE);
    // Get the string
    return bytes.subarray(offset + 2, offset + 2 + strLen).toString("utf8");
}
export function getLenBlob(bytes, offset, isLE) {
    // Get the length of the blob
    const blobLen = getDWord(bytes, offset, isLE);
    // Get the blob
    return bytes.subarray(offset + 2, offset + 2 + blobLen);
}
export function getShortBool(bytes, offset) {
    // Get a 2 byte boolean
    return bytes.readUInt16LE(offset) === 1;
}
