/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EpcGen2 } from '@openrfid/epc';

export interface Sgtin96Params {
  filter: number; // 3 bits
  partition: number; // 3 bits (defines company prefix vs item ref bit lengths)
  companyPrefix: string;
  itemRef: string;
  serialNumber: string;
}

export class Sgtin96 {
  public static readonly HEADER = '00110000'; // 0x30 in binary (8 bits)

  // Partition table bit allocations: [companyPrefixBits, companyPrefixDigits, itemRefBits, itemRefDigits]
  private static readonly PARTITION_TABLE: Record<number, [number, number, number, number]> = {
    0: [40, 12, 4, 1],
    1: [37, 11, 7, 2],
    2: [34, 10, 10, 3],
    3: [30, 9, 14, 4],
    4: [27, 8, 17, 5],
    5: [24, 7, 20, 6],
    6: [20, 6, 24, 7],
  };

  public static encode(params: Sgtin96Params): string {
    const partitionInfo = this.PARTITION_TABLE[params.partition];
    if (!partitionInfo) {
      throw new Error(`Invalid SGTIN-96 partition value: ${params.partition}`);
    }

    const [companyBits, , itemBits] = partitionInfo;

    const headerBin = this.HEADER;
    const filterBin = params.filter.toString(2).padStart(3, '0');
    const partitionBin = params.partition.toString(2).padStart(3, '0');
    const companyBin = BigInt(params.companyPrefix).toString(2).padStart(companyBits, '0');
    const itemBin = BigInt(params.itemRef).toString(2).padStart(itemBits, '0');
    const serialBin = BigInt(params.serialNumber).toString(2).padStart(38, '0'); // 38 bits serial

    const binary96 = headerBin + filterBin + partitionBin + companyBin + itemBin + serialBin;
    if (binary96.length !== 96) {
      throw new Error(`Invalid total bit length for SGTIN-96: ${binary96.length} bits (expected 96)`);
    }

    return EpcGen2.binaryToHex(binary96);
  }

  public static decode(hex: string): Sgtin96Params {
    const binary = EpcGen2.hexToBinary(hex);
    if (binary.length < 96) {
      throw new Error('Hex string is too short for SGTIN-96');
    }

    const header = binary.substring(0, 8);
    if (header !== this.HEADER) {
      throw new Error(`Invalid SGTIN-96 header binary: ${header} (expected 0x30 / ${this.HEADER})`);
    }

    const filter = parseInt(binary.substring(8, 11), 2);
    const partition = parseInt(binary.substring(11, 14), 2);

    const partitionInfo = this.PARTITION_TABLE[partition];
    if (!partitionInfo) {
      throw new Error(`Invalid partition code in SGTIN-96 binary: ${partition}`);
    }

    const [companyBits, companyDigits, itemBits, itemDigits] = partitionInfo;

    let offset = 14;
    const companyPrefixBin = binary.substring(offset, offset + companyBits);
    offset += companyBits;

    const itemRefBin = binary.substring(offset, offset + itemBits);
    offset += itemBits;

    const serialBin = binary.substring(offset, offset + 38);

    const companyPrefix = BigInt(`0b${companyPrefixBin}`).toString().padStart(companyDigits, '0');
    const itemRef = BigInt(`0b${itemRefBin}`).toString().padStart(itemDigits, '0');
    const serialNumber = BigInt(`0b${serialBin}`).toString();

    return {
      filter,
      partition,
      companyPrefix,
      itemRef,
      serialNumber,
    };
  }
}
