export enum TimeDisplayOptions {
  'HOUR_12' = 'HOUR_12',
  'HOUR_24' = 'HOUR_24',
}

export enum TemperatureDisplayOptions {
  'FAHRENHEIT' = 'FAHRENHEIT',
  'CELSIUS' = 'CELSIUS',
}

export interface IAccountSettings {
  accountSettingId: number;
  timeDisplaySetting: TimeDisplayOptions;
  temperatureDisplaySetting: TemperatureDisplayOptions;
}

export interface IUpdateAccountSetting {
  userId: number;
  setting: TimeDisplayOptions | TemperatureDisplayOptions;
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
