import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import {
  IEntityInfoRequest,
  IDeviceInformationCurrentDay,
  IHomescreenInfoResponse,
  ILocation,
  IViewHomeInfoResponse,
} from '../model/get-info';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  private readonly getInfoRoot = '/getInfo';
  private readonly getHomeScreenInfoPath = '/homeScreenInfo';
  private readonly getViewHomeInfoPath = '/viewHomeInfo';
  private readonly getViewLocationInfoPath = '/viewLocationInfo';
  private readonly getInformationByDeviceCurrentDay = '/informationByDeviceCurrentDay';

  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  getHomescreenInfo(request: IEntityInfoRequest): Observable<IHomescreenInfoResponse> {
    return this.httpClient.get<IHomescreenInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getHomeScreenInfoPath +
        '/' +
        request.id,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting home screen info'),
      },
    );
  }

  getViewHomeInfo(request: IEntityInfoRequest): Observable<IViewHomeInfoResponse> {
    return this.httpClient.get<IViewHomeInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewHomeInfoPath +
        '/' +
        request.id,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting home info'),
      },
    );
  }

  getViewLocationInfo(request: IEntityInfoRequest): Observable<ILocation> {
    return this.httpClient.get<ILocation>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewLocationInfoPath +
        '/' +
        request.id,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting location info'),
      },
    );
  }

  getViewDeviceInformation(request: IEntityInfoRequest): Observable<IDeviceInformationCurrentDay> {
    return this.httpClient.get<IDeviceInformationCurrentDay>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getInformationByDeviceCurrentDay +
        '/' +
        request.id,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting device info'),
      },
    );
  }

  generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
