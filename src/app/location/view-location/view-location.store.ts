import { inject } from '@angular/core';
import { IDevice, ILocation } from '../../model/get-info';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { GetInfoService } from '../../services/get-info';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ITemperatureThreshold } from '../../model/temperature-threshold';
import { TemperatureThresholdService } from '../../services/temperature-threshold';
import { IDeleteDeviceResponse } from '../../model/delete-actions';
import { DeleteService } from '../../services/delete';
import { setAverageTemperature } from '../../shared/utility/temperature-utility';
import { ITemperatureThresholdModalLimits } from './temperature-threshold-modal/temperature-threshold-modal';
import { IRegisterGenericEntityRequest } from '../../model/registration';
import { RegistrationService } from '../../services/registration';

export type ViewLocationActions =
  | 'get-view-location-info'
  | 'add-threshold'
  | 'update-threshold'
  | 'delete-threshold'
  | 'delete-location'
  | 'delete-device'
  | 'register-device'
  | null;

interface ViewLocationState {
  locationInfo: ILocation | null;
  averageTemperature: number | null;
  successNotification: ViewLocationActions;
  errorNotification: ViewLocationActions;
}

const initialState: ViewLocationState = {
  locationInfo: null,
  averageTemperature: null,
  successNotification: null,
  errorNotification: null,
};

export const ViewLocationStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store) => {
    const getInfoService = inject(GetInfoService);
    const registrationService = inject(RegistrationService);
    const temperatureThresholdService = inject(TemperatureThresholdService);
    const deleteService = inject(DeleteService);

    return {
      getLocationInfo: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap((locationId: number) =>
            getInfoService.getViewLocationInfo({ id: locationId }).pipe(
              tapResponse({
                next: (locationInfo: ILocation) =>
                  patchState(store, {
                    locationInfo,
                    averageTemperature: setAverageTemperature(locationInfo.devices),
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-location-info' as ViewLocationActions,
                  }),
              }),
            ),
          ),
        ),
      ),

      addTemperatureThreshold: rxMethod<ITemperatureThresholdModalLimits>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: ITemperatureThresholdModalLimits) => {
            const locationId = store.locationInfo()?.locationId;

            if (!locationId) {
              patchState(store, {
                errorNotification: 'add-threshold' as ViewLocationActions,
              });
              return EMPTY;
            }

            return temperatureThresholdService
              .addTemperatureThreshold({
                minimumTemperature: request.minimumTemperature,
                maximumTemperature: request.maximumTemperature,
                locationId,
              })
              .pipe(
                tapResponse({
                  next: (threshold: ITemperatureThreshold) =>
                    patchState(store, (state) => ({
                      locationInfo: state.locationInfo
                        ? { ...state.locationInfo, threshold }
                        : null,
                      successNotification: 'add-threshold' as ViewLocationActions,
                    })),
                  error: () =>
                    patchState(store, {
                      errorNotification: 'add-threshold' as ViewLocationActions,
                    }),
                }),
              );
          }),
        ),
      ),

      updateTemperatureThreshold: rxMethod<ITemperatureThresholdModalLimits>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: ITemperatureThresholdModalLimits) => {
            const newThreshold: ITemperatureThreshold | null =
              store.locationInfo()?.threshold ?? null;

            if (newThreshold === null) {
              patchState(store, {
                errorNotification: 'update-threshold' as ViewLocationActions,
              });
              return EMPTY;
            }

            newThreshold.minimumTemperature = request.minimumTemperature;
            newThreshold.maximumTemperature = request.maximumTemperature;

            return temperatureThresholdService.updateTemperatureThreshold(newThreshold).pipe(
              tapResponse({
                next: () =>
                  patchState(store, (state) => ({
                    locationInfo:
                      state.locationInfo && state.locationInfo.threshold
                        ? {
                            ...state.locationInfo,
                            threshold: {
                              ...state.locationInfo.threshold,
                              minimumTemperature: request.minimumTemperature,
                              maximumTemperature: request.maximumTemperature,
                            },
                          }
                        : null,
                    successNotification: 'update-threshold' as ViewLocationActions,
                  })),
                error: () =>
                  patchState(store, {
                    errorNotification: 'update-threshold' as ViewLocationActions,
                  }),
              }),
            );
          }),
        ),
      ),

      deleteTemperatureThreshold: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap(() => {
            const thresholdId = store.locationInfo()?.threshold?.id;

            if (!thresholdId) {
              patchState(store, {
                errorNotification: 'delete-threshold' as ViewLocationActions,
              });
              return EMPTY;
            }

            return temperatureThresholdService.deleteTemperatureThreshold(thresholdId).pipe(
              tapResponse({
                next: () =>
                  patchState(store, (state) => ({
                    locationInfo: state.locationInfo
                      ? {
                          ...state.locationInfo,
                          threshold: null,
                        }
                      : null,
                    successNotification: 'delete-threshold' as ViewLocationActions,
                  })),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-threshold' as ViewLocationActions,
                  }),
              }),
            );
          }),
        ),
      ),

      deleteLocation: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap(() => {
            const locationId = store.locationInfo()?.locationId;

            if (!locationId) {
              patchState(store, {
                errorNotification: 'delete-location' as ViewLocationActions,
              });
              return EMPTY;
            }

            return deleteService.deleteLocationById({ id: locationId }).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    locationInfo: null,
                    averageTemperature: null,
                    successNotification: 'delete-location' as ViewLocationActions,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-location' as ViewLocationActions,
                  }),
              }),
            );
          }),
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
                    const devices: IDevice[] = state.locationInfo
                      ? state.locationInfo.devices.filter(
                          (device) => device.deviceId !== response.deviceId,
                        )
                      : [];

                    return {
                      locationInfo: state.locationInfo
                        ? {
                            ...state.locationInfo,
                            devices,
                            averageTemperature: setAverageTemperature(devices),
                          }
                        : null,
                      successNotification: 'delete-device' as ViewLocationActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-device' as ViewLocationActions,
                  }),
              }),
            ),
          ),
        ),
      ),

      registerDevice: rxMethod<IRegisterGenericEntityRequest>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: IRegisterGenericEntityRequest) => {
            return registrationService
              .registerDevice({ parentEntityId: request.parentEntityId, name: request.name })
              .pipe(
                tapResponse({
                  next: () =>
                    patchState(store, {
                      successNotification: 'register-device' as ViewLocationActions,
                    }),
                  error: () =>
                    patchState(store, {
                      errorNotification: 'register-device' as ViewLocationActions,
                    }),
                }),
              );
          }),
        ),
      ),

      resetNotificationState(): void {
        patchState(store, {
          successNotification: null,
          errorNotification: null,
        });
      },

      reset(): void {
        patchState(store, initialState);
      },
    };
  }),
);
