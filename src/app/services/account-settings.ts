import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvironmentService } from './environment';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import {
  IAccountSettings,
  IUpdateAccountSetting,
  IUpdateTemperatureDisplaySettingResponse,
  IUpdateTimeDisplaySettingResponse,
  TemperatureDisplayOptions,
  TimeDisplayOptions,
} from '../model/account-settings';
import { SessionStorageService } from './session-storage';
import { ACCOUNT_SETTINGS_KEY } from '../constants/session-storage-constants';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);
  private readonly sessionStorageService = inject(SessionStorageService);

  private readonly accountSettingsRoot = '/accountSettings';
  private readonly getAccountSettingsPath = '/getSettings';
  private readonly updateTimeDisplaySettingPath = '/timeDisplay';
  private readonly updateTemperatureDisplaySettingPath = '/temperatureDisplay';

  setAccountSettingsSessionStorage(accountSettings: IAccountSettings): void {
    this.sessionStorageService.setItem(ACCOUNT_SETTINGS_KEY, JSON.stringify(accountSettings));
  }

  getAccountSettingsFromSessionStorage(): IAccountSettings | null {
    const accountSettingsValue: string | null =
      this.sessionStorageService.getItem(ACCOUNT_SETTINGS_KEY);
    let accountSettings: IAccountSettings | null = null;

    if (accountSettingsValue) {
      accountSettings = JSON.parse(accountSettingsValue);
    }

    return accountSettings;
  }

  updateTimeDisplaySettingSessionStorage(timeDisplaySetting: TimeDisplayOptions): void {
    const accountSettings: IAccountSettings | null = this.getAccountSettingsFromSessionStorage();

    // Set the time display setting if the account settings are stored in session storage.
    if (accountSettings) {
      accountSettings.timeDisplaySetting = timeDisplaySetting;
      this.setAccountSettingsSessionStorage(accountSettings);
    }
  }

  updateTemperatureDisplaySettingSessionStorage(
    temperatureDisplaySetting: TemperatureDisplayOptions,
  ): void {
    const accountSettings: IAccountSettings | null = this.getAccountSettingsFromSessionStorage();

    // Set the temperature display setting if the account settings are stored in session storage.
    if (accountSettings) {
      accountSettings.temperatureDisplaySetting = temperatureDisplaySetting;
      this.setAccountSettingsSessionStorage(accountSettings);
    }
  }

  getAccountSettings(userId: number): Observable<IAccountSettings> {
    return this.httpClient
      .get<IAccountSettings>(
        this.environmentService.getEnvironment().backendUrl +
          this.accountSettingsRoot +
          this.getAccountSettingsPath +
          '/' +
          userId,
        {
          context: new HttpContext().set(LoadingContextToken, 'Getting account settings'),
        },
      )
      .pipe(
        map((response: IAccountSettings) => {
          this.setAccountSettingsSessionStorage(response);
          return response;
        }),
      );
  }

  // Store result in session storage.
  updateTimeDisplaySetting(
    request: IUpdateAccountSetting,
  ): Observable<IUpdateTimeDisplaySettingResponse> {
    return this.httpClient
      .put<IUpdateTimeDisplaySettingResponse>(
        this.environmentService.getEnvironment().backendUrl +
          this.accountSettingsRoot +
          this.updateTimeDisplaySettingPath,
        request,
        {
          context: new HttpContext().set(LoadingContextToken, 'Updating time display setting'),
        },
      )
      .pipe(
        map((response: IUpdateTimeDisplaySettingResponse) => {
          this.updateTimeDisplaySettingSessionStorage(response.timeSetting);
          return response;
        }),
      );
  }

  // Store result in session storage.
  updateTemperatureDisplaySetting(
    request: IUpdateAccountSetting,
  ): Observable<IUpdateTemperatureDisplaySettingResponse> {
    return this.httpClient
      .put<IUpdateTemperatureDisplaySettingResponse>(
        this.environmentService.getEnvironment().backendUrl +
          this.accountSettingsRoot +
          this.updateTemperatureDisplaySettingPath,
        request,
        {
          context: new HttpContext().set(
            LoadingContextToken,
            'Updating temperature display setting',
          ),
        },
      )
      .pipe(
        map((response: IUpdateTemperatureDisplaySettingResponse) => {
          this.updateTemperatureDisplaySettingSessionStorage(response.temperatureSetting);
          return response;
        }),
      );
  }
}
