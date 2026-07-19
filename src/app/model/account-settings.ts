export enum TimeDisplayOptions {
  'HOUR_12' = 'HOUR_12',
  'HOUR_24' = 'HOUR_24',
}

export enum TemperatureDisplayOptions {
  'FAHRENHEIT' = 'FAHRENHEIT',
  'CELSIUS' = 'CELSIUS',
}

export enum ThemeDisplayOptions {
  'LIGHT' = 'LIGHT',
  'DARK' = 'DARK',
}

export interface IAccountSettings {
  accountSettingId: number;
  timeDisplaySetting: TimeDisplayOptions;
  temperatureDisplaySetting: TemperatureDisplayOptions;
  themeDisplaySetting: ThemeDisplayOptions;
}

export interface IUpdateAccountSetting {
  userId: number;
  setting: TimeDisplayOptions | TemperatureDisplayOptions | ThemeDisplayOptions;
}

export interface IUpdateTimeDisplaySettingResponse {
  userId: number;
  settingId: number;
  timeSetting: TimeDisplayOptions;
}

export interface IUpdateTemperatureDisplaySettingResponse {
  userId: number;
  settingId: number;
  temperatureSetting: TemperatureDisplayOptions;
}

export interface IUpdateThemeDisplaySettingResponse {
  userId: number;
  settingId: number;
  themeSetting: ThemeDisplayOptions;
}
