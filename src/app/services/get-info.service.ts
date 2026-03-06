import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { LoginService } from './login.service';
import {
  IDeviceInformationCurrentDay,
  IHomeScreenInfoRequest,
  IHomeScreenInfoResponse,
  ILocation,
  IViewHomeInfoRequest,
  IViewHomeInfoResponse,
  IViewLocationInfoRequest,
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

  getHomeScreenInfo(request: IHomeScreenInfoRequest) {
    return this.httpClient.get<IHomeScreenInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getHomeScreenInfoPath +
        '/' +
        request.userId,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting home screen info'),
      },
    );
  }

  getViewHomeInfo(request: IViewHomeInfoRequest) {
    return this.httpClient.get<IViewHomeInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewHomeInfoPath +
        '/' +
        request.homeId,
      {
        headers: this.generateHeaderWithBearerToken(request.jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Getting home info'),
      },
    );
  }

  getViewLocationInfo(request: IViewLocationInfoRequest) {
    return this.httpClient.get<ILocation>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewLocationInfoPath +
        '/' +
        request.locationId,
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
