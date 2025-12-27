import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { SessionStorageService } from './session-storage.service';
import { LoginService } from './login.service';
import { IHomeScreenInfoRequest, IHomeScreenInfoResponse } from '../model/home-screen.interface';
import { IDeviceInformationCurrentDay, ILocation } from '../model/get-info.interface';
import { IViewHomeInfoRequest, IViewHomeInfoResponse } from '../model/view-home.interface';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  getInfoRoot = '/getInfo';
  getHomeScreenInfoPath = '/homeScreenInfo';
  getViewHomeInfoPath = '/viewHomeInfo';
  getLocationsByHomeIdPath = '/locationsByHome';
  getInformationByDeviceCurrentDay = '/informationByDeviceCurrentDay';

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

  getLocationsByHomeId(homeId: string) {
    return this.httpClient.get<ILocation[]>(
      this.environmentService.getEnvironment().backendUrl +
        this.getInfoRoot +
        this.getLocationsByHomeIdPath +
        '/' +
        homeId,
    );
  }

  getViewDeviceInformation(deviceId: string) {
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
