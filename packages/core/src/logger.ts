/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  data?: any;
}

export class Logger {
  private levelWeights: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(
    private context: string = 'App',
    private minLevel: LogLevel = 'info'
  ) {}

  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (this.levelWeights[level] < this.levelWeights[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
    };

    const formatted = `[${entry.timestamp}] [${level.toUpperCase()}] [${entry.context}]: ${message}`;
    if (level === 'error') {
      console.error(formatted, data !== undefined ? data : '');
    } else if (level === 'warn') {
      console.warn(formatted, data !== undefined ? data : '');
    } else {
      console.log(formatted, data !== undefined ? data : '');
    }
  }
}
