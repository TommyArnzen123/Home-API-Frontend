import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { Observable } from 'rxjs';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { IRegisterGenericEntityRequest, IRegisterGenericEntityResponse, IRegisterUserRequest } from '../model/registration.interface';

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

  registerUser(registerUserRequest: IRegisterUserRequest): Observable<IRegisterGenericEntityResponse> {
    return this.httpClient.post<IRegisterGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerUserPath,
      registerUserRequest,
      { context: new HttpContext().set(LoadingContextToken, 'Registering new user') },
    );
  }

  registerHome(
    registerHomeRequest: IRegisterGenericEntityRequest,
    jwtToken: string,
  ): Observable<IRegisterGenericEntityResponse> {
    return this.httpClient.post<IRegisterGenericEntityResponse>(
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
    registerLocationRequest: IRegisterGenericEntityRequest,
    jwtToken: string,
  ): Observable<IRegisterGenericEntityResponse> {
    return this.httpClient.post<IRegisterGenericEntityResponse>(
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
