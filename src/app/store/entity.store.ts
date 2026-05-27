import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { GetInfoService } from '../services/get-info';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  IDeviceSummary,
  IHome,
  IHomescreenInfoResponse,
  ILocationSummary,
  ITemperature,
  IViewDeviceInfoResponse,
  IViewHomeInfoResponse,
  IViewLocationInfoResponse,
} from '../model/get-info';
import { DeleteService } from '../services/delete';
import {
  IDeleteDeviceResponse,
  IDeleteHomeResponse,
  IDeleteLocationResponse,
} from '../model/delete-actions';
import { RegistrationService } from '../services/registration';
import {
  IDeleteTemperatureThresholdRequest,
  ITemperatureThreshold,
} from '../model/temperature-threshold';
import { TemperatureThresholdService } from '../services/temperature-threshold';
import { IRegisterGenericEntityRequest } from '../model/registration';

export type EntityActions =
  | 'get-view-homescreen-info'
  | 'get-view-home-info'
  | 'get-view-location-info'
  | 'get-view-device-info'
  | 'register-home'
  | 'register-location'
  | 'register-device'
  | 'add-temperature-threshold'
  | 'update-temperature-threshold'
  | 'delete-temperature-threshold'
  | 'delete-home'
  | 'delete-location'
  | 'delete-device'
  | null;

type EntityTypes = 'HOME' | 'LOCATION' | 'DEVICE';

export interface IBreadcrumb {
  type: EntityTypes;
  id: number;
}

interface EntityData<TSummary, TDetails> {
  entityId: number;
  parentId?: number;
  summary: TSummary;
  details?: TDetails;
  detailsSet: boolean;
}

interface HomeSummary {
  homeName: string;
  totalLocations: number;
  totalDevices: number;
}

interface HomeDetails {
  homeName: string;
}

interface LocationSummary {
  locationName: string;
  numDevices: number;
  averageTemperature: number;
  threshold: ITemperatureThreshold;
}

interface LocationDetails {
  locationName: string;
  threshold?: ITemperatureThreshold;
}

interface DeviceSummary {
  deviceName: string;
  temperature: ITemperature;
}

interface DeviceDetails {
  deviceName: string;
  temperature: ITemperature;
}

export type HomeData = EntityData<HomeSummary, HomeDetails>;
export type LocationData = EntityData<LocationSummary, LocationDetails>;
export type DeviceData = EntityData<DeviceSummary, DeviceDetails>;

interface IEntityState {
  userId: number | null;
  userFirstName: string | null;
  userInitialized: boolean;
  homes: Record<number, HomeData>;
  locations: Record<number, LocationData>;
  devices: Record<number, DeviceData>;
  entityPath: Array<IBreadcrumb>;
  selectedEntity: IBreadcrumb | null;
  successNotification: EntityActions;
  errorNotification: EntityActions;
}

const initialState: IEntityState = {
  userId: null,
  userFirstName: null,
  userInitialized: false,
  homes: {},
  locations: {},
  devices: {},
  entityPath: [],
  selectedEntity: null,
  successNotification: null,
  errorNotification: null,
};

export const EntityStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store) => {
    const getInfoService = inject(GetInfoService);
    const registrationService = inject(RegistrationService);
    const thresholdService = inject(TemperatureThresholdService);
    const deleteService = inject(DeleteService);

    return {
      setUserInformation(userId: number, userFirstName: string): void {
        patchState(store, {
          userId,
          userFirstName,
          userInitialized: true,
        });
      },

      getHomescreenInfo: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap(() => {
            const userId = store.userId();

            if (!userId) {
              patchState(store, {
                errorNotification: 'get-view-homescreen-info',
              });
              return EMPTY;
            }

            return getInfoService.getHomescreenInfo({ id: userId }).pipe(
              tapResponse({
                next: (homescreenInfo: IHomescreenInfoResponse) =>
                  patchState(store, {
                    homes: generateHomeSummaryObjects(homescreenInfo.homes),
                    entityPath: homescreenInfo.entityPath,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-homescreen-info',
                  }),
              }),
            );
          }),
        ),
      ),

      getViewHomeInfo: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap((homeId: number) => {
            return getInfoService.getViewHomeInfo({ id: homeId }).pipe(
              tapResponse({
                next: (homeResponse: IViewHomeInfoResponse) =>
                  patchState(store, {
                    homes: {
                      ...store.homes(),
                      [homeResponse.homeId]: generateHomeDetailsObject(
                        store.homes()[homeResponse.homeId],
                        homeResponse,
                      ),
                    },
                    locations: generateLocationSummaryObjects(homeResponse.locations),
                    entityPath: homeResponse.entityPath,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-home-info',
                  }),
              }),
            );
          }),
        ),
      ),

      getViewLocationInfo: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap((locationId: number) => {
            return getInfoService.getViewLocationInfo({ id: locationId }).pipe(
              tapResponse({
                next: (locationResponse: IViewLocationInfoResponse) =>
                  patchState(store, {
                    locations: {
                      ...store.locations(),
                      [locationResponse.locationId]: generateLocationDetailsObject(
                        store.locations()[locationResponse.locationId],
                        locationResponse,
                      ),
                    },
                    devices: generateDeviceSummaryObjects(locationResponse.devices),
                    entityPath: locationResponse.entityPath,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-location-info',
                  }),
              }),
            );
          }),
        ),
      ),

      getViewDeviceInfo: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap((deviceId: number) => {
            return getInfoService.getViewDeviceInfo({ id: deviceId }).pipe(
              tapResponse({
                next: (deviceResponse: IViewDeviceInfoResponse) =>
                  patchState(store, {
                    devices: {
                      ...store.devices(),
                      [deviceResponse.deviceId]: generateDeviceDetailsObject(
                        store.devices()[deviceResponse.deviceId],
                        deviceResponse,
                      ),
                    },
                    entityPath: deviceResponse.entityPath,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-device-info',
                  }),
              }),
            );
          }),
        ),
      ),

      registerHome: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((homeName: string) => {
            const userId = store.userId();

            if (!userId) {
              patchState(store, {
                errorNotification: 'register-home',
              });
              return EMPTY;
            }

            return registrationService
              .registerHome({ parentEntityId: userId, name: homeName })
              .pipe(
                tapResponse({
                  next: () =>
                    patchState(store, {
                      // New home object does not need to be set here.
                      // The new home object will be fetched when routed to the homescreen.
                      successNotification: 'register-home',
                    }),
                  error: () =>
                    patchState(store, {
                      errorNotification: 'register-home',
                    }),
                }),
              );
          }),
        ),
      ),

      registerLocation: rxMethod<IRegisterGenericEntityRequest>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: IRegisterGenericEntityRequest) => {
            return registrationService.registerLocation(request).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    // New location object does not need to be set here.
                    // The new location object will be fetched when routed to the view home page.
                    successNotification: 'register-location',
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'register-location',
                  }),
              }),
            );
          }),
        ),
      ),

      registerDevice: rxMethod<IRegisterGenericEntityRequest>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: IRegisterGenericEntityRequest) => {
            return registrationService.registerDevice(request).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    // New device object does not need to be set here.
                    // The new device object will be fetched when routed to the view location page.
                    successNotification: 'register-device',
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'register-device',
                  }),
              }),
            );
          }),
        ),
      ),

      addTemperatureThreshold: rxMethod<ITemperatureThreshold>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((thresholdRequest: ITemperatureThreshold) =>
            thresholdService.addTemperatureThreshold(thresholdRequest).pipe(
              tapResponse({
                next: (thresholdResponse: ITemperatureThreshold) =>
                  patchState(store, {
                    locations: {
                      ...store.locations(),
                      [thresholdResponse.locationId]: modifyTemperatureThresholdInObject(
                        thresholdResponse,
                        store.locations()[thresholdResponse.locationId],
                      ),
                    },
                    successNotification: 'add-temperature-threshold',
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'add-temperature-threshold',
                  }),
              }),
            ),
          ),
        ),
      ),

      updateTemperatureThreshold: rxMethod<ITemperatureThreshold>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((thresholdRequest: ITemperatureThreshold) =>
            thresholdService.updateTemperatureThreshold(thresholdRequest).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    locations: {
                      ...store.locations(),
                      [thresholdRequest.locationId]: modifyTemperatureThresholdInObject(
                        thresholdRequest,
                        store.locations()[thresholdRequest.locationId],
                      ),
                    },
                    successNotification: 'update-temperature-threshold',
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'update-temperature-threshold',
                  }),
              }),
            ),
          ),
        ),
      ),

      deleteTemperatureThreshold: rxMethod<IDeleteTemperatureThresholdRequest>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((deleteThresholdRequest: IDeleteTemperatureThresholdRequest) =>
            thresholdService.deleteTemperatureThreshold(deleteThresholdRequest.id).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    locations: {
                      ...store.locations(),
                      [deleteThresholdRequest.locationId]: modifyTemperatureThresholdInObject(
                        null,
                        store.locations()[deleteThresholdRequest.locationId],
                      ),
                    },
                    successNotification: 'delete-temperature-threshold',
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-temperature-threshold',
                  }),
              }),
            ),
          ),
        ),
      ),

      deleteHome: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((id: number) =>
            deleteService.deleteHomeById({ id }).pipe(
              tapResponse({
                next: (response: IDeleteHomeResponse) =>
                  patchState(store, (state) => {
                    const newHomes: Record<number, HomeData> = Object.fromEntries(
                      Object.entries(state.homes).filter(
                        ([homeId]) => Number(homeId) !== response.homeId,
                      ),
                    );

                    return {
                      homes: newHomes,
                      successNotification: 'delete-home' as EntityActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-home',
                  }),
              }),
            ),
          ),
        ),
      ),

      deleteLocation: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((id: number) =>
            deleteService.deleteLocationById({ id }).pipe(
              tapResponse({
                next: (response: IDeleteLocationResponse) =>
                  patchState(store, (state) => {
                    const newLocations: Record<number, LocationData> = Object.fromEntries(
                      Object.entries(state.locations).filter(
                        ([locationId]) => Number(locationId) !== response.locationId,
                      ),
                    );

                    return {
                      locations: newLocations,
                      successNotification: 'delete-location' as EntityActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-location',
                  }),
              }),
            ),
          ),
        ),
      ),

      deleteDevice: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((id: number) =>
            deleteService.deleteDeviceById({ id }).pipe(
              tapResponse({
                next: (response: IDeleteDeviceResponse) =>
                  patchState(store, (state) => {
                    const newDevices: Record<number, DeviceData> = Object.fromEntries(
                      Object.entries(state.devices).filter(
                        ([deviceId]) => Number(deviceId) !== response.deviceId,
                      ),
                    );

                    return {
                      devices: newDevices,
                      successNotification: 'delete-device' as EntityActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-device',
                  }),
              }),
            ),
          ),
        ),
      ),

      setSelectedEntity(entityInfo: IBreadcrumb | null): void {
        patchState(store, {
          selectedEntity: entityInfo,
        });
      },

      resetNotificationState(): void {
        patchState(store, {
          successNotification: null,
          errorNotification: null,
        });
      },

      reset(): void {
        patchState(store, initialState);
      },

      // TO BE DELETED. - Used to view entity store state.
      viewStore(): void {
        console.log(store.selectedEntity());
        console.log(store.entityPath());
        console.log(store.homes());
        console.log(store.locations());
        console.log(store.devices());
      },
    };
  }),
);

function generateHomeSummaryObjects(homes: IHome[]): Record<number, HomeData> {
  const homeRecords: Record<number, HomeData> = {};

  homes.forEach((home) => {
    const homeData: HomeData = {
      entityId: home.homeId,
      parentId: home.userId,
      summary: {
        homeName: home.homeName,
        totalLocations: home.totalLocations,
        totalDevices: home.totalDevices,
      },
      detailsSet: false,
    };
    homeRecords[home.homeId] = homeData;
  });

  return homeRecords;
}

function generateHomeDetailsObject(homeData: HomeData, homeInfo: IViewHomeInfoResponse): HomeData {
  const newHomeData: HomeData = {
    ...homeData,
    entityId: homeInfo.homeId,
    details: {
      homeName: homeInfo.homeName,
    },
    detailsSet: true,
  };

  return newHomeData;
}

function generateLocationSummaryObjects(
  locations: ILocationSummary[],
): Record<number, LocationData> {
  const locationRecords: Record<number, LocationData> = {};

  locations.forEach((location) => {
    const locationData: LocationData = {
      entityId: location.locationId,
      parentId: location.homeId,
      summary: {
        locationName: location.locationName,
        numDevices: location.numDevices,
        averageTemperature: location.averageTemperature,
        threshold: location.threshold,
      },
      detailsSet: false,
    };

    locationRecords[location.locationId] = locationData;
  });

  return locationRecords;
}

function generateLocationDetailsObject(
  locationData: LocationData,
  locationInfo: IViewLocationInfoResponse,
): LocationData {
  const newLocationData: LocationData = {
    ...locationData,
    entityId: locationInfo.locationId,
    parentId: locationInfo.homeId,
    details: {
      locationName: locationInfo.locationName,
      threshold: locationInfo.threshold,
    },
    detailsSet: true,
  };

  return newLocationData;
}

function generateDeviceDetailsObject(
  deviceData: DeviceData,
  deviceInfo: IViewDeviceInfoResponse,
): DeviceData {
  const newDeviceData: DeviceData = {
    ...deviceData,
    entityId: deviceInfo.deviceId,
    parentId: deviceInfo.locationId,
    details: {
      deviceName: deviceInfo.deviceName,
      temperature: deviceInfo.temperature,
    },
    detailsSet: true,
  };

  return newDeviceData;
}

function modifyTemperatureThresholdInObject(
  temperatureThreshold: ITemperatureThreshold | null,
  locationData: LocationData,
): LocationData {
  const newLocationData: LocationData = {
    ...locationData,
    details: {
      locationName: locationData.details?.locationName || '', // Look at doing this a different way. OPTIONAL SETTING. - SHOULD BE SET.
      threshold: temperatureThreshold ?? undefined,
    },
  };

  return newLocationData;
}

function generateDeviceSummaryObjects(devices: IDeviceSummary[]): Record<number, DeviceData> {
  const deviceRecords: Record<number, DeviceData> = {};

  devices.forEach((device) => {
    const deviceData: DeviceData = {
      entityId: device.deviceId,
      parentId: device.locationId,
      summary: { deviceName: device.deviceName, temperature: device.temperature },
      detailsSet: false,
    };

    deviceRecords[device.deviceId] = deviceData;
  });

  return deviceRecords;
}
