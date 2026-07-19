/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EpcGen2 } from '@openrfid/epc';
import { Sgtin96 } from '@openrfid/gs1';
import { Tag } from './tag-model';

export interface BatchGenerationOptions {
  count: number;
  type: 'sequential' | 'random' | 'sgtin96';
  header?: string;
  companyPrefix?: string;
  itemRef?: string;
  startSerial?: number;
}

export class TagGenerator {
  public static generateBatch(options: BatchGenerationOptions): Tag[] {
    const tags: Tag[] = [];
    const count = options.count || 10;
    const type = options.type || 'sequential';
    const startSerial = options.startSerial || 1;

    for (let i = 0; i < count; i++) {
      let epc = '';
      if (type === 'random') {
        epc = EpcGen2.generateRandomEpc(options.header || 'E200');
      } else if (type === 'sgtin96') {
        epc = Sgtin96.encode({
          filter: 1,
          partition: 5,
          companyPrefix: options.companyPrefix || '0614141',
          itemRef: options.itemRef || '123456',
          serialNumber: (startSerial + i).toString(),
        });
      } else {
        // Sequential
        epc = EpcGen2.generateSequentialEpc(startSerial + i, options.header || 'E20000000000');
      }

      tags.push(new Tag({ epc }));
    }

    return tags;
  }
}
