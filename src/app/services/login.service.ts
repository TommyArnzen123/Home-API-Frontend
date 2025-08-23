import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { ILoginRequest, ILoginResponse } from '../model/login.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _loginBehaviorSubject = new BehaviorSubject<boolean>(false);
  private loginStatus = this._loginBehaviorSubject.asObservable();
  private loginUrl = '/login';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
  ) {}

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    this._loginBehaviorSubject.next(isLoggedIn);
  }

  login(loginRequest: ILoginRequest): Observable<ILoginResponse> {
    return this.httpClient.post<ILoginResponse>(
      this.environmentService.getEnvironment().backendUrl + this.loginUrl,
      loginRequest,
    );
  }
}
