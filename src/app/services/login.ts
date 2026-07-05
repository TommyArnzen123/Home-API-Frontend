import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EnvironmentService } from './environment';
import { SessionStorageService } from './session-storage';
import { ILoginRequest, ILoginInfo, IUserInfo } from '../model/login';
import {
  ACCOUNT_SETTINGS_KEY,
  JWT_TOKEN_KEY,
  USER_INFO_KEY,
} from '../constants/session-storage-constants';
import { LOGIN_ROUTE } from '../constants/navigation-constants';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { EntityStore } from '../store/entity.store';
import { IAccountSettings } from '../model/account-settings';
import { AccountSettingsService } from './account-settings';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = '/login';

  private readonly entityStore = inject(EntityStore);
  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly router = inject(Router);

  constructor() {
    this.populateUserFromSessionStorage();
    this.populateAccountSettingsFromSessionStorage();
    this.populateJwtTokenFromSessionStorage();
  }

  populateUserFromSessionStorage(): void {
    const user: string | null = this.sessionStorageService.getItem(USER_INFO_KEY);
    let userInfo: IUserInfo | null = null;

    if (user) {
      userInfo = JSON.parse(user);

      if (userInfo) {
        this.setUserInformation(userInfo);
      }
    }
  }

  setUserInformation(userInfo: IUserInfo | null): void {
    this.entityStore.setUserInformation(userInfo);
  }

  // Store the account settings in the signal store.
  setAccountSettingsSignalStore(accountSettings: IAccountSettings | null): void {
    this.entityStore.setAccountSettings(accountSettings);
  }

  populateAccountSettingsFromSessionStorage(): void {
    const accountSettingsInfo: string | null =
      this.sessionStorageService.getItem(ACCOUNT_SETTINGS_KEY);
    let accountSettings: IAccountSettings | null = null;

    if (accountSettingsInfo) {
      accountSettings = JSON.parse(accountSettingsInfo);

      if (accountSettings) {
        this.setAccountSettingsSignalStore(accountSettings);
      }
    }
  }

  populateJwtTokenFromSessionStorage(): void {
    const jwtTokenInfo: string | null = this.sessionStorageService.getItem(JWT_TOKEN_KEY);
    let jwtToken: string | null = null;

    if (jwtTokenInfo) {
      jwtToken = JSON.parse(jwtTokenInfo);

      if (jwtToken) {
        this.setJwtToken(jwtToken);
      }
    }
  }

  setJwtToken(jwtToken: string | null): void {
    this.entityStore.setJwtToken(jwtToken);
  }

  login(loginRequest: ILoginRequest): Observable<ILoginInfo> {
    return this.httpClient
      .post<ILoginInfo>(
        this.environmentService.getEnvironment().backendUrl + this.loginUrl,
        loginRequest,
        { context: new HttpContext().set(LoadingContextToken, 'Logging In') },
      )
      .pipe(
        tap((response: ILoginInfo) => {
          const accountSettings: IAccountSettings = {
            accountSettingId: response.accountSettings.accountSettingId,
            timeDisplaySetting: response.accountSettings.timeDisplaySetting,
            temperatureDisplaySetting: response.accountSettings.temperatureDisplaySetting,
          };

          this.sessionStorageService.setItem(USER_INFO_KEY, JSON.stringify(response.userInfo));
          this.accountSettingsService.setAccountSettingsSessionStorage(accountSettings);
          this.sessionStorageService.setItem(JWT_TOKEN_KEY, JSON.stringify(response.jwtToken));
          this.setUserInformation(response.userInfo);
          this.setAccountSettingsSignalStore(accountSettings);
          this.setJwtToken(response.jwtToken);
        }),
      );
  }

  logout(): void {
    this.entityStore.reset(); // Clear the entity store.
    this.sessionStorageService.clearSessionStorage(); // Clear the session storage variables.
    this.router.navigateByUrl(LOGIN_ROUTE); // Route to the login screen.
  }

  logoutWithoutRoute(): void {
    this.entityStore.reset(); // Clear the entity store.
    this.sessionStorageService.clearSessionStorage(); // Clear the session storage variables.
  }

  isIUser(value: ILoginInfo | null): value is ILoginInfo {
    return (
      value !== null &&
      typeof value.userInfo.userId === 'number' &&
      typeof value.userInfo.firstName === 'string' &&
      // typeof value.userInfo.username === 'string' &&
      typeof value.jwtToken === 'string'
    );
  }
}
