/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { DataFormatter } from '@openrfid/utils';
import { Tag, TagProps } from './tag-model';

export class TagSerializer {
  public static toCSV(tags: Tag[]): string {
    const data = tags.map((t) => t.toJSON());
    return DataFormatter.toCSV(data);
  }

  public static fromCSV(csvContent: string): Tag[] {
    const rawList = DataFormatter.parseCSV(csvContent);
    return rawList.map(
      (row) =>
        new Tag({
          id: row.id,
          epc: row.epc,
          tid: row.tid,
          userMemory: row.userMemory,
          accessPassword: row.accessPassword,
          killPassword: row.killPassword,
          protocol: row.protocol,
        })
    );
  }

  public static toJSON(tags: Tag[]): string {
    return JSON.stringify(tags.map((t) => t.toJSON()), null, 2);
  }

  public static fromJSON(jsonContent: string): Tag[] {
    const parsed: TagProps[] = JSON.parse(jsonContent);
    return parsed.map((props) => new Tag(props));
  }
}
