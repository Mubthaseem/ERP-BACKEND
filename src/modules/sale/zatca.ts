/**
 * ZATCA (FATOORA) E-Invoicing TLV (Tag-Length-Value) Base64 Generator
 * Complies with Saudi Arabia ZATCA E-Invoicing Phase 1 & Phase 2 specifications.
 */

function getTlvBuffer(tag: number, value: string): Buffer {
  const valueBuf = Buffer.from(value, 'utf-8');
  const tagBuf = Buffer.from([tag]);
  const lengthBuf = Buffer.from([valueBuf.length]);
  return Buffer.concat([tagBuf, lengthBuf, valueBuf]);
}

export interface IZatcaInvoiceInput {
  sellerName: string;
  vatNumber: string;
  timestamp: string;      // ISO 8601 formatted timestamp e.g. 2026-08-01T14:30:00Z
  invoiceTotal: string;   // Formatted total e.g. "115.00"
  vatTotal: string;       // Formatted VAT total e.g. "15.00"
}

export function generateZatcaTlvQrCode(input: IZatcaInvoiceInput): string {
  const tag1 = getTlvBuffer(1, input.sellerName);
  const tag2 = getTlvBuffer(2, input.vatNumber);
  const tag3 = getTlvBuffer(3, input.timestamp);
  const tag4 = getTlvBuffer(4, input.invoiceTotal);
  const tag5 = getTlvBuffer(5, input.vatTotal);

  const qrBuffer = Buffer.concat([tag1, tag2, tag3, tag4, tag5]);
  return qrBuffer.toString('base64');
}
