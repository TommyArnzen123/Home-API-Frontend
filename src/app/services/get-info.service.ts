import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { SessionStorageService } from './session-storage.service';
import { LoginService } from './login.service';
import { IHomeScreenInfoRequest, IHomeScreenInfoResponse } from '../model/home-screen.interface';
import { IDeviceInformationCurrentDay, ILocation, IViewHomeInfoRequest, IViewHomeInfoResponse, IViewLocationInfoRequest } from '../model/get-info.interface';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  private getInfoRoot = '/getInfo';
  private getHomeScreenInfoPath = '/homeScreenInfo';
  private getViewHomeInfoPath = '/viewHomeInfo';
  private getViewLocationInfoPath = '/viewLocationInfo';
  private getInformationByDeviceCurrentDay = '/informationByDeviceCurrentDay';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
    private readonly loginService: LoginService,
  ) {}

  getHomeScreenInfo(request: IHomeScreenInfoRequest) {
    return this.httpClient.get<IHomeScreenInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getHomeScreenInfoPath +
        '/' +
        request.userId,
      { headers: this.generateHeaderWithBearerToken(request.jwtToken) },
    );
  }

  getViewHomeInfo(request: IViewHomeInfoRequest) {
    return this.httpClient.get<IViewHomeInfoResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewHomeInfoPath +
        '/' +
        request.homeId,
      { headers: this.generateHeaderWithBearerToken(request.jwtToken) },
    );
  }

  getViewLocationInfo(request: IViewLocationInfoRequest) {
    return this.httpClient.get<ILocation>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getViewLocationInfoPath +
        '/' +
        request.locationId,
        { headers: this.generateHeaderWithBearerToken(request.jwtToken) },
    );
  }

  getViewDeviceInformation(deviceId: number) {
    return this.httpClient.get<IDeviceInformationCurrentDay>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getInformationByDeviceCurrentDay +
        '/' +
        deviceId,
    );
  }

  generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
