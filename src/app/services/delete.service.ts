import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { IDeleteDeviceRequest, IDeleteDeviceResponse, IDeleteHomeRequest, IDeleteHomeResponse, IDeleteLocationRequest, IDeleteLocationResponse } from '../model/delete-actions.interface';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private deleteRoot = '/delete';
  private deleteHomePath = '/home';
  private deleteLocationPath = '/location';
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

  deleteLocationById(request: IDeleteLocationRequest) {
    return this.httpClient.delete<IDeleteLocationResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteLocationPath +
        '/' +
        request.locationId,
    );
  }

  deleteDeviceById(request: IDeleteDeviceRequest) {
    return this.httpClient.delete<IDeleteDeviceResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteDevicePath +
        '/' +
        request.deviceId,
    );
  }
}
