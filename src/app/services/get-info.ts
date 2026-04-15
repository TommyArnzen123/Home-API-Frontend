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

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  private getInfoRoot = '/getInfo';
  private getHomeScreenInfoPath = '/homeScreenInfo';
  private getViewHomeInfoPath = '/viewHomeInfo';
  private getViewLocationInfoPath = '/viewLocationInfo';
  private getInformationByDeviceCurrentDay = '/informationByDeviceCurrentDay';

  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  getHomescreenInfo(request: IEntityInfoRequest) {
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

  getViewHomeInfo(request: IEntityInfoRequest) {
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

  getViewLocationInfo(request: IEntityInfoRequest) {
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

  getViewDeviceInformation(request: IEntityInfoRequest) {
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
