import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { IRegisterUserRequest, IRegisterUserResponse } from '../model/registration.interface';
import { Observable } from 'rxjs';

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

  registerUser(registerUserRequest: IRegisterUserRequest): Observable<IRegisterUserResponse> {
    return this.httpClient.post<IRegisterUserResponse>(
      this.environmentService.getEnvironment().backendUrl +
        this.registrationRoot +
        this.registerUserPath,
      registerUserRequest,
    );
  }
}
