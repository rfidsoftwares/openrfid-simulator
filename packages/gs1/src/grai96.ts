/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EpcGen2 } from '@openrfid/epc';

export interface Grai96Params {
  filter: number;
  partition: number;
  companyPrefix: string;
  assetType: string;
  serialNumber: string;
}

export class Grai96 {
  public static readonly HEADER = '00110011'; // 0x33 in binary (8 bits)

  public static encode(params: Grai96Params): string {
    const headerBin = this.HEADER;
    const filterBin = params.filter.toString(2).padStart(3, '0');
    const partitionBin = params.partition.toString(2).padStart(3, '0');
    
    // Standard partition 5: 24-bit company prefix, 20-bit asset type, 38-bit serial
    const companyBin = BigInt(params.companyPrefix).toString(2).padStart(24, '0');
    const assetBin = BigInt(params.assetType).toString(2).padStart(20, '0');
    const serialBin = BigInt(params.serialNumber).toString(2).padStart(38, '0');

    const binary96 = headerBin + filterBin + partitionBin + companyBin + assetBin + serialBin;
    return EpcGen2.binaryToHex(binary96);
  }

  public static decode(hex: string): Grai96Params {
    const binary = EpcGen2.hexToBinary(hex);
    const filter = parseInt(binary.substring(8, 11), 2);
    const partition = parseInt(binary.substring(11, 14), 2);
    const companyPrefix = BigInt(`0b${binary.substring(14, 38)}`).toString();
    const assetType = BigInt(`0b${binary.substring(38, 58)}`).toString();
    const serialNumber = BigInt(`0b${binary.substring(58, 96)}`).toString();

    return { filter, partition, companyPrefix, assetType, serialNumber };
  }
}
