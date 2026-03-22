import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { LoginService } from './login.service';
import {
  IEntityInfoRequest,
  IDeviceInformationCurrentDay,
  IHomeScreenInfoResponse,
  ILocation,
  IViewHomeInfoResponse,
} from '../model/get-info.interface';
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
  private readonly loginService = inject(LoginService);

  getHomeScreenInfo(request: IEntityInfoRequest) {
    return this.httpClient.get<IHomeScreenInfoResponse>(
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

  getViewDeviceInformation(deviceId: number) {
    return this.httpClient.get<IDeviceInformationCurrentDay>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getInformationByDeviceCurrentDay +
        '/' +
        deviceId,
      { context: new HttpContext().set(LoadingContextToken, 'Getting device info') },
    );
  }

  generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
