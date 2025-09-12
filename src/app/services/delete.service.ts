import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private deleteRoot = '/delete';
  private deleteDevicePath = '/device';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
  ) {}

  deleteDeviceById(deviceId: string) {
    return this.httpClient.delete<string>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteDevicePath +
        '/' +
        deviceId,
    );
  }
}
