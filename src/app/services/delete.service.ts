import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import {
  IDeleteDeviceRequest,
  IDeleteDeviceResponse,
  IDeleteHomeRequest,
  IDeleteHomeResponse,
  IDeleteLocationRequest,
  IDeleteLocationResponse,
} from '../model/delete-actions.interface';
import { LoadingContextToken } from '../interceptor/http-context-tokens';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private deleteRoot = '/delete';
  private deleteHomePath = '/home';
  private deleteLocationPath = '/location';
  private deleteDevicePath = '/device';

  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  deleteHomeById(request: IDeleteHomeRequest) {
    return this.httpClient.delete<IDeleteHomeResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteHomePath +
        '/' +
        request.homeId,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting home') },
    );
  }

  deleteLocationById(request: IDeleteLocationRequest) {
    return this.httpClient.delete<IDeleteLocationResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteLocationPath +
        '/' +
        request.locationId,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting location') },
    );
  }

  deleteDeviceById(request: IDeleteDeviceRequest) {
    return this.httpClient.delete<IDeleteDeviceResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteDevicePath +
        '/' +
        request.deviceId,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting device') },
    );
  }
}
