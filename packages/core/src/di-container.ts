/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export type Factory<T> = (container: Container) => T;

export class Container {
  private services = new Map<string, { factory: Factory<any>; singleton: boolean; instance?: any }>();

  public register<T>(key: string, factory: Factory<T>, singleton = true): void {
    this.services.set(key, { factory, singleton });
  }

  public registerInstance<T>(key: string, instance: T): void {
    this.services.set(key, { factory: () => instance, singleton: true, instance });
  }

  public resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service '${key}' is not registered in the DI Container.`);
    }

    if (service.singleton) {
      if (!service.instance) {
        service.instance = service.factory(this);
      }
      return service.instance;
    }

    return service.factory(this);
  }

  public has(key: string): boolean {
    return this.services.has(key);
  }

  public reset(): void {
    this.services.clear();
  }
}
