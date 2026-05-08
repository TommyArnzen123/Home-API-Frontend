import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
  IRegisterUserRequest,
} from '../model/registration';
import { LoadingContextToken } from '../interceptor/http-context-tokens';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  private registrationRoot = '/register';
  private registerUserPath = '/user';
  private registerHomePath = '/home';
  private registerLocationPath = '/location';
  private registerDevicePath = '/device';

  registerUser(
    registerUserRequest: IRegisterUserRequest,
  ): Observable<IRegisterGenericEntityResponse> {
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
  ): Observable<IRegisterGenericEntityResponse> {
    return this.httpClient.post<IRegisterGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerHomePath,
      registerHomeRequest,
      {
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
        context: new HttpContext().set(LoadingContextToken, 'Registering new location'),
      },
    );
  }

  registerDevice(
    registerDeviceRequest: IRegisterGenericEntityRequest,
  ): Observable<IRegisterGenericEntityResponse> {
    return this.httpClient.post<IRegisterGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerDevicePath,
      registerDeviceRequest,
      {
        context: new HttpContext().set(LoadingContextToken, 'Registering new device'),
      },
    );
  }
}
