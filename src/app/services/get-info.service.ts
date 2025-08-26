import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { SessionStorageService } from './session-storage.service';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';
import { ILoginResponse } from '../model/login.interface';
import { IHomeScreenInfoRequest, IHomeScreenInfoResponse } from '../model/home-screen.interface';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  getInfoRoot = '/getInfo';
  getHomeScreenInfoPath = '/homeScreenInfo';

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

  generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
