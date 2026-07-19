/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export enum ComponentState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  DISPOSED = 'DISPOSED',
  ERROR = 'ERROR',
}

export interface ILifecycle {
  state: ComponentState;
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  dispose(): Promise<void>;
}
