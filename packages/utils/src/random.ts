/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export class RandomGenerator {
  public static uniform(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  public static integer(min: number, max: number): number {
    return Math.floor(this.uniform(min, max + 1));
  }

  // Box-Muller transform for Gaussian / Normal distribution
  public static gaussian(mean = 0, stdDev = 1): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  }

  public static boolean(probabilityTrue = 0.5): boolean {
    return Math.random() < probabilityTrue;
  }
}
