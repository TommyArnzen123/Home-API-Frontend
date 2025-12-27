import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { IDeleteHomeRequest, IDeleteHomeResponse } from '../model/delete-actions.interface';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private deleteRoot = '/delete';
  private deleteHomePath = '/home';
  private deleteDevicePath = '/device';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
  ) {}
  
  deleteHomeById(request: IDeleteHomeRequest) {
    return this.httpClient.delete<IDeleteHomeResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteHomePath +
        '/' +
        request.homeId,
    );
  }

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
