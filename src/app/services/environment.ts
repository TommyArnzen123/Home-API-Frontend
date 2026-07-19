import { Injectable } from '@angular/core';
import { IEnvironment } from '../model/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // 60 seconds -> 1 minute.
  private readonly ENTITY_GET_INFO_NETWORK_CALL_POLLING_INTERVAL: number = 10000; // Milliseconds.

  getEnvironment(): IEnvironment {
    // if (this.isLocalhost(window.location.hostname)) {
    const environment: IEnvironment = {
      backendUrl: 'http://localhost:8080',
    };

    return environment;
    // }
  }

  isLocalhost(url: string): boolean {
    return url === 'localhost';
  }

  // Return the number of milliseconds between entity 'getInfo' network calls for polling
  // use-cases.
  getEntityInfoPollingRefreshInterval(): number {
    return this.ENTITY_GET_INFO_NETWORK_CALL_POLLING_INTERVAL;
  }
}
