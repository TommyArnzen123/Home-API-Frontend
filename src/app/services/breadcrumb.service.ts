import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  #homeId$ = signal<number | null>(null);
  private homeIdReadonly = this.#homeId$.asReadonly();

  #locationId$ = signal<number | null>(null);
  private locationIdReadonly = this.#locationId$.asReadonly();

  #deviceId$ = signal<number | null>(null);
  private deviceIdReadonly = this.#deviceId$.asReadonly();

  getHomeId(): Signal<number | null> {
    return this.homeIdReadonly;
  }

  updateHomeId(homeId: number | null): void {
    this.#homeId$.set(homeId);
    this.#locationId$.set(null);
    this.#deviceId$.set(null);
  }

  getLocationId(): Signal<number | null> {
    return this.locationIdReadonly;
  }

  updateLocationId(locationId: number | null): void {
    this.#locationId$.set(locationId);
    this.#deviceId$.set(null);
  }

  getDeviceId(): Signal<number | null> {
    return this.deviceIdReadonly;
  }

  updateDeviceId(deviceId: number | null): void {
    this.#deviceId$.set(deviceId);
  }

  clearService(): void {
    this.#homeId$.set(null);
    this.#locationId$.set(null);
    this.#deviceId$.set(null);
  }
}
