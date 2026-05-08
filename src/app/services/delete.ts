import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import {
  IDeleteEntityRequest,
  IDeleteDeviceResponse,
  IDeleteHomeResponse,
  IDeleteLocationResponse,
} from '../model/delete-actions';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { Observable } from 'rxjs';

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

  deleteHomeById(request: IDeleteEntityRequest): Observable<IDeleteHomeResponse> {
    return this.httpClient.delete<IDeleteHomeResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteHomePath +
        '/' +
        request.id,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting home') },
    );
  }

  deleteLocationById(request: IDeleteEntityRequest): Observable<IDeleteLocationResponse> {
    return this.httpClient.delete<IDeleteLocationResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteLocationPath +
        '/' +
        request.id,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting location') },
    );
  }

  deleteDeviceById(request: IDeleteEntityRequest): Observable<IDeleteDeviceResponse> {
    return this.httpClient.delete<IDeleteDeviceResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.deleteRoot +
        this.deleteDevicePath +
        '/' +
        request.id,
      { context: new HttpContext().set(LoadingContextToken, 'Deleting device') },
    );
  }
}
