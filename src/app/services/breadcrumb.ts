import { Injectable, Signal, signal } from '@angular/core';

export type PageInFocus = 'home-page' | 'view-home' | 'view-location' | 'view-device';

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

  #pageInFocus$ = signal<PageInFocus>('home-page');
  private pageInFocusReadonly = this.#pageInFocus$.asReadonly();

  getHomeId(): Signal<number | null> {
    return this.homeIdReadonly;
  }

  updateHomeId(homeId: number | null): void {
    this.#homeId$.set(homeId);
  }

  getLocationId(): Signal<number | null> {
    return this.locationIdReadonly;
  }

  updateLocationId(locationId: number | null): void {
    this.#locationId$.set(locationId);
  }

  getDeviceId(): Signal<number | null> {
    return this.deviceIdReadonly;
  }

  updateDeviceId(deviceId: number | null): void {
    this.#deviceId$.set(deviceId);
  }

  getPageInFocus(): Signal<PageInFocus> {
    return this.pageInFocusReadonly;
  }

  updatePageInFocus(page: PageInFocus): void {
    this.#pageInFocus$.set(page);
  }

  clearService(): void {
    this.#homeId$.set(null);
    this.#locationId$.set(null);
    this.#deviceId$.set(null);
  }
}
