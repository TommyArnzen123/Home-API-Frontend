import { Injectable, signal } from '@angular/core';
import { LoadingInterface } from '../model/loading.interface';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  #loadingSignal = signal<LoadingInterface>({ isLoading: false, message: '' });

  loading = this.#loadingSignal.asReadonly();

  loadingOn(message: string) {
    this.#loadingSignal.set({ isLoading: true, message });
  }

  loadingOff() {
    this.#loadingSignal.set({ isLoading: false, message: '' });
  }
}
