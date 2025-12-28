import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import {
  IRegisterHomeRequest,
  IRegisterHomeResponse,
  IRegisterLocationRequest,
  IRegisterLocationResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
} from '../model/registration.interface';
import { Observable } from 'rxjs';
import { LoadingContextToken } from '../interceptor/http-context-tokens';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
  ) {}

  private registrationRoot = '/register';
  private registerUserPath = '/user';
  private registerHomePath = '/home';
  private registerLocationPath = '/location';

  registerUser(registerUserRequest: IRegisterUserRequest): Observable<IRegisterUserResponse> {
    return this.httpClient.post<IRegisterUserResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerUserPath,
      registerUserRequest,
      { context: new HttpContext().set(LoadingContextToken, 'Registering new user') },
    );
  }

  registerHome(
    registerHomeRequest: IRegisterHomeRequest,
    jwtToken: string,
  ): Observable<IRegisterHomeResponse> {
    return this.httpClient.post<IRegisterHomeResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerHomePath,
      registerHomeRequest,
      {
        headers: this.generateHeaderWithBearerToken(jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Registering new home'),
      },
    );
  }

  registerLocation(
    registerLocationRequest: IRegisterLocationRequest,
    jwtToken: string,
  ): Observable<IRegisterLocationResponse> {
    return this.httpClient.post<IRegisterLocationResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerLocationPath,
      registerLocationRequest,
      {
        headers: this.generateHeaderWithBearerToken(jwtToken),
        context: new HttpContext().set(LoadingContextToken, 'Registering new location'),
      },
    );
  }

  generateHeaderWithBearerToken(jwtToken: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
  }
}
