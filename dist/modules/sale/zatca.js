"use strict";
/**
 * ZATCA (FATOORA) E-Invoicing TLV (Tag-Length-Value) Base64 Generator
 * Complies with Saudi Arabia ZATCA E-Invoicing Phase 1 & Phase 2 specifications.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZatcaTlvQrCode = generateZatcaTlvQrCode;
function getTlvBuffer(tag, value) {
    const valueBuf = Buffer.from(value, 'utf-8');
    const tagBuf = Buffer.from([tag]);
    const lengthBuf = Buffer.from([valueBuf.length]);
    return Buffer.concat([tagBuf, lengthBuf, valueBuf]);
}
function generateZatcaTlvQrCode(input) {
    const tag1 = getTlvBuffer(1, input.sellerName);
    const tag2 = getTlvBuffer(2, input.vatNumber);
    const tag3 = getTlvBuffer(3, input.timestamp);
    const tag4 = getTlvBuffer(4, input.invoiceTotal);
    const tag5 = getTlvBuffer(5, input.vatTotal);
    const qrBuffer = Buffer.concat([tag1, tag2, tag3, tag4, tag5]);
    return qrBuffer.toString('base64');
}
