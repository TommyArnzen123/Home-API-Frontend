import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { SessionStorageService } from './session-storage.service';
import { USER_LOGIN_INFO_KEY } from '../constants/session-storage-constants';
import { LOGIN_ROUTE } from '../constants/navigation-constants';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { ILoginRequest, IUser } from '../model/login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  #loginResponseInfo$ = signal<IUser | null>(null);
  private userLoginInfo = this.#loginResponseInfo$.asReadonly();
  private loginUrl = '/login';

  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly router = inject(Router);

  constructor() {
    this.loadUserFromSessionStorage();
  }

  loadUserFromSessionStorage() {
    const userInfo = this.sessionStorageService.getItem(USER_LOGIN_INFO_KEY);

    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.#loginResponseInfo$.set(user);
    }
  }

  isLoggedIn = computed(() => !!this.userLoginInfo());

  getUserLoginInfo(): Signal<IUser | null> {
    return this.userLoginInfo;
  }

  private updateUserLoginInfo(userInfo: IUser | null): void {
    this.#loginResponseInfo$.set(userInfo);
  }

  login(loginRequest: ILoginRequest): Observable<IUser> {
    return this.httpClient
      .post<IUser>(
        this.environmentService.getEnvironment().backendUrl + this.loginUrl,
        loginRequest,
        { context: new HttpContext().set(LoadingContextToken, 'Logging In') },
      )
      .pipe(
        tap((response) => {
          this.sessionStorageService.setItem(USER_LOGIN_INFO_KEY, JSON.stringify(response));
          this.updateUserLoginInfo(response);
        }),
      );
  }

  logout(): void {
    this.sessionStorageService.removeItem(USER_LOGIN_INFO_KEY); // Remove the user login info from session storage.
    this.updateUserLoginInfo(null); // Remove the user login info from memory.
    this.router.navigateByUrl(LOGIN_ROUTE); // Route to the login screen.
  }

  logoutWithoutRoute(): void {
    this.sessionStorageService.removeItem(USER_LOGIN_INFO_KEY); // Remove the user login info from session storage.
    this.updateUserLoginInfo(null); // Remove the user login info from memory.
  }
}
