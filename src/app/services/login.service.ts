import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { ILoginRequest, ILoginResponse } from '../model/login.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { JWT_TOKEN, USER_ID } from '../constants/session-storage-constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _loginBehaviorSubject = new BehaviorSubject<boolean>(false);
  private _loginResponseInfoSubject = new BehaviorSubject<ILoginResponse>({
    userId: '',
    username: '',
    firstName: '',
    jwtToken: '',
  });
  private loginStatus = this._loginBehaviorSubject.asObservable();
  private userLoginInfo = this._loginResponseInfoSubject.asObservable();
  private loginUrl = '/login';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
    private readonly sessionStorageService: SessionStorageService,
  ) {}

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus;
  }

  getUserLoginInfo(): Observable<ILoginResponse> {
    return this.userLoginInfo;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    this._loginBehaviorSubject.next(isLoggedIn);
  }

  updateUserLoginInfo(userInfo: ILoginResponse): void {
    this._loginResponseInfoSubject.next(userInfo);
  }

  login(loginRequest: ILoginRequest): Observable<ILoginResponse> {
    return this.httpClient
      .post<ILoginResponse>(
        this.environmentService.getEnvironment().backendUrl + this.loginUrl,
        loginRequest,
      )
      .pipe(
        tap((response) => {
          this.sessionStorageService.setItem(USER_ID, response.userId);
          this.sessionStorageService.setItem(JWT_TOKEN, response.jwtToken);
          this.updateLoginStatus(true);
          this.updateUserLoginInfo(response);
        }),
      );
  }
}
