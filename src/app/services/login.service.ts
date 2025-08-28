import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { ILoginRequest, ILoginResponse } from '../model/login.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { JWT_TOKEN, USER_ID } from '../constants/session-storage-constants';
import { Router } from '@angular/router';
import { APP_ROOT_ROUTE } from '../constants/navigation-constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _loginResponseInfoSubject = new BehaviorSubject<ILoginResponse>({
    userId: '',
    username: '',
    firstName: '',
    jwtToken: '',
  });
  private userLoginInfo = this._loginResponseInfoSubject.asObservable();
  private loginUrl = '/login';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly environmentService: EnvironmentService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
  ) {}

  getUserLoginInfo(): Observable<ILoginResponse> {
    return this.userLoginInfo;
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
          this.updateUserLoginInfo(response);
        }),
      );
  }

  logout(): void {
    this.sessionStorageService.removeItem(USER_ID);
    this.sessionStorageService.removeItem(JWT_TOKEN);

    const emptyUserLoginInfo: ILoginResponse = {
      userId: '',
      firstName: '',
      username: '',
      jwtToken: '',
    };
    this.updateUserLoginInfo(emptyUserLoginInfo);
    this.router.navigateByUrl(APP_ROOT_ROUTE);
  }
}
