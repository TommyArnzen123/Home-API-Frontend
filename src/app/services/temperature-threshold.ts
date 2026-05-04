import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import {
  IDeleteTemperatureThresholdRequest,
  ITemperatureThresholdRequest,
  ITemperatureThreshold,
} from '../model/temperature-threshold';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemperatureThresholdService {
  private readonly temperatureThresholdRoot = '/temperatureThreshold';

  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  addTemperatureThreshold(
    request: ITemperatureThresholdRequest,
  ): Observable<ITemperatureThreshold> {
    return this.httpClient.post<ITemperatureThreshold>(
      this.environmentService.getEnvironment().backendUrl + this.temperatureThresholdRoot,
      request,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Adding temperature threshold'),
      },
    );
  }

  updateTemperatureThreshold(request: ITemperatureThresholdRequest): Observable<string> {
    return this.httpClient.put<string>(
      this.environmentService.getEnvironment().backendUrl + this.temperatureThresholdRoot,
      request,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Updating temperature threshold'),
      },
    );
  }

  deleteTemperatureThreshold(
    deleteTemperatureThresholdRequest: IDeleteTemperatureThresholdRequest,
  ): Observable<string> {
    return this.httpClient.delete<string>(
      this.environmentService.getEnvironment().backendUrl +
        this.temperatureThresholdRoot +
        '/' +
        deleteTemperatureThresholdRequest.thresholdId,
      {
        headers: this.generateHeaderWithBearerToken(deleteTemperatureThresholdRequest.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Deleting temperature threshold'),
      },
    );
  }

  private generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
