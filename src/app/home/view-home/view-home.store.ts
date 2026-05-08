import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ILocation, IViewHomeInfoResponse } from '../../model/get-info';
import { GetInfoService } from '../../services/get-info';
import { DeleteService } from '../../services/delete';
import { IDeleteLocationResponse } from '../../model/delete-actions';
import { IRegisterGenericEntityRequest } from '../../model/registration';
import { RegistrationService } from '../../services/registration';

export type ViewHomeActions =
  | 'get-view-home-info'
  | 'delete-home'
  | 'delete-location'
  | 'register-location'
  | null;

interface HomescreenState {
  homeId: number | null;
  homeName: string | null;
  locations: ILocation[];
  totalDevices: number;
  successNotification: ViewHomeActions;
  errorNotification: ViewHomeActions;
}

const initialState: HomescreenState = {
  homeId: null,
  homeName: null,
  locations: [],
  totalDevices: 0,
  successNotification: null,
  errorNotification: null,
};

export const ViewHomeStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store) => {
    const getInfoService = inject(GetInfoService);
    const registrationService = inject(RegistrationService);
    const deleteService = inject(DeleteService);

    return {
      getHomeInfo: rxMethod<number>(
        pipe(
          tap(() =>
            patchState(store, {
              successNotification: null,
              errorNotification: null,
            }),
          ),
          switchMap((homeId: number) =>
            getInfoService.getViewHomeInfo({ id: homeId }).pipe(
              tapResponse({
                next: (homeInfo: IViewHomeInfoResponse) =>
                  patchState(store, {
                    homeId: homeInfo.homeId,
                    homeName: homeInfo.homeName,
                    locations: homeInfo.locations,
                    totalDevices: getTotalDevicesForViewHome(homeInfo.locations),
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-home-info' as ViewHomeActions,
                  }),
              }),
            ),
          ),
        ),
      ),

      deleteHome: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap(() => {
            const homeId = store.homeId();

            if (!homeId) {
              patchState(store, {
                errorNotification: 'delete-home' as ViewHomeActions,
              });
              return EMPTY;
            }

            return deleteService.deleteHomeById({ id: homeId }).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    homeId: null,
                    homeName: null,
                    locations: [],
                    totalDevices: 0,
                    successNotification: 'delete-home' as ViewHomeActions,
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-home' as ViewHomeActions,
                  }),
              }),
            );
          }),
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
                    const locations: ILocation[] = state.locations
                      ? state.locations.filter(
                          (location) => location.locationId !== response.locationId,
                        )
                      : [];

                    return {
                      locations,
                      totalDevices: getTotalDevicesForViewHome(locations),
                      successNotification: 'delete-location' as ViewHomeActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-location' as ViewHomeActions,
                  }),
              }),
            ),
          ),
        ),
      ),

      registerLocation: rxMethod<IRegisterGenericEntityRequest>(
        pipe(
          tap(() => patchState(store, { successNotification: null, errorNotification: null })),
          switchMap((request: IRegisterGenericEntityRequest) => {
            return registrationService
              .registerLocation({ parentEntityId: request.parentEntityId, name: request.name })
              .pipe(
                tapResponse({
                  next: () =>
                    patchState(store, {
                      successNotification: 'register-location' as ViewHomeActions,
                    }),
                  error: () =>
                    patchState(store, {
                      errorNotification: 'register-location' as ViewHomeActions,
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

function getTotalDevicesForViewHome(locations: ILocation[]): number {
  let totalDevices = 0;

  locations.forEach((location) => {
    totalDevices += location.devices.length;
  });

  return totalDevices;
}
