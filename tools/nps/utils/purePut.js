export function put16(bytes, offset, word, isLE) {
    // Put the word at the offset
    if (isLE) {
        bytes.writeUInt16LE(word, offset);
    }
    else {
        bytes.writeUInt16BE(word, offset);
    }
    return bytes;
}
export function put8(bytes, offset, byte) {
    // Put the byte at the offset
    bytes.writeUInt8(byte, offset);
    return bytes;
}
export function put16BE(bytes, offset, word) {
    return put16(bytes, offset, word, false);
}
export function put16LE(bytes, offset, word) {
    return put16(bytes, offset, word, true);
}
export function put32(bytes, offset, word, isLE) {
    // Put the word at the offset
    if (isLE) {
        bytes.writeUInt32LE(word, offset);
    }
    else {
        bytes.writeUInt32BE(word, offset);
    }
    return bytes;
}
export function put32BE(bytes, offset, word) {
    return put32(bytes, offset, word, false);
}
export function put32LE(bytes, offset, word) {
    return put32(bytes, offset, word, true);
}
export function putLenString(bytes, offset, str, isLE) {
    // Get the length of the string
    const strLen = str.length + 1;
    // Put the length of the string
    if (isLE) {
        bytes.writeUInt32LE(strLen, offset);
    }
    else {
        bytes.writeUInt32BE(strLen, offset);
    }
    // Put the string
    bytes.write(str.concat("\0"), offset + 4, strLen, "utf8");
    return bytes;
}
export function putLenBlob(bytes, offset, blob, isLE) {
    // Get the length of the blob
    const blobLen = blob.length;
    // Put the length of the blob
    if (isLE) {
        bytes.writeUInt32LE(blobLen, offset);
    }
    else {
        bytes.writeUInt32BE(blobLen, offset);
    }
    // Put the blob
    blob.copy(bytes, offset + 4);
    return bytes;
}
export function putShortBool(bytes, offset, bool) {
    // Put a 2 byte boolean
    bytes.writeUInt16LE(bool ? 1 : 0, offset);
    return bytes;
}
