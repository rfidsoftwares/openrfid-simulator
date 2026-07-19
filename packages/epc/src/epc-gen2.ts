/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { calculateCRC16 } from './checksum';

export enum MemoryBank {
  RESERVED = 0,
  EPC = 1,
  TID = 2,
  USER = 3,
}

export interface EpcData {
  hex: string;
  binary: string;
  ascii: string;
  bitLength: number;
}

export class EpcGen2 {
  public static hexToBinary(hex: string): string {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    let binary = '';
    for (let i = 0; i < cleanHex.length; i++) {
      const bin = parseInt(cleanHex[i], 16).toString(2).padStart(4, '0');
      binary += bin;
    }
    return binary;
  }

  public static binaryToHex(binary: string): string {
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0');
    let hex = '';
    for (let i = 0; i < padded.length; i += 4) {
      hex += parseInt(padded.substring(i, i + 4), 2).toString(16).toUpperCase();
    }
    return hex;
  }

  public static hexToAscii(hex: string): string {
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substring(i, i + 2), 16);
      if (code >= 32 && code <= 126) {
        ascii += String.fromCharCode(code);
      } else {
        ascii += '.';
      }
    }
    return ascii;
  }

  public static asciiToHex(ascii: string): string {
    let hex = '';
    for (let i = 0; i < ascii.length; i++) {
      hex += ascii.charCodeAt(i).toString(16).padStart(2, '0').toUpperCase();
    }
    return hex;
  }

  public static parse(hex: string): EpcData {
    const cleanHex = hex.toUpperCase().replace(/[^0-9A-F]/g, '');
    const binary = this.hexToBinary(cleanHex);
    const ascii = this.hexToAscii(cleanHex);

    return {
      hex: cleanHex,
      binary,
      ascii,
      bitLength: binary.length,
    };
  }

  public static generateRandomEpc(header = 'E200'): string {
    let randomPart = '';
    const length = 24 - header.length; // Default 96-bit (24 hex chars)
    for (let i = 0; i < length; i++) {
      randomPart += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    }
    return header + randomPart;
  }

  public static generateSequentialEpc(index: number, header = 'E20000000000'): string {
    const suffix = index.toString(16).toUpperCase().padStart(12, '0');
    return header + suffix;
  }

  public static getCRC(hex: string): string {
    const crcVal = calculateCRC16(hex);
    return crcVal.toString(16).toUpperCase().padStart(4, '0');
  }
}
