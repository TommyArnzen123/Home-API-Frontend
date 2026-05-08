import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { GetInfoService } from '../services/get-info';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { IHome, IHomescreenInfoResponse } from '../model/get-info';
import { LoginService } from '../services/login';
import { DeleteService } from '../services/delete';
import { IDeleteHomeResponse } from '../model/delete-actions';
import { RegistrationService } from '../services/registration';

export type HomescreenActions = 'get-view-homescreen-info' | 'register-home' | 'delete-home' | null;

interface HomescreenState {
  userId: number | null;
  userFirstName: string | null;
  homeInfo: IHome[];
  totalHomes: number;
  totalLocations: number;
  totalDevices: number;
  successNotification: HomescreenActions;
  errorNotification: HomescreenActions;
}

const initialState: HomescreenState = {
  userId: null,
  userFirstName: null,
  homeInfo: [],
  totalHomes: 0,
  totalLocations: 0,
  totalDevices: 0,
  successNotification: null,
  errorNotification: null,
};

export const HomescreenStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => {
    const loginService = inject(LoginService);
    const userInfo = loginService.getUserLoginInfo();

    return {
      ...initialState,
      userId: userInfo()?.userId ?? null,
      userFirstName: userInfo()?.firstName ?? null,
    };
  }),
  withMethods((store) => {
    const getInfoService = inject(GetInfoService);
    const registrationService = inject(RegistrationService);
    const deleteService = inject(DeleteService);

    return {
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
                errorNotification: 'get-view-homescreen-info' as HomescreenActions,
              });
              return EMPTY;
            }

            return getInfoService.getHomescreenInfo({ id: userId }).pipe(
              tapResponse({
                next: (homescreenInfo: IHomescreenInfoResponse) =>
                  patchState(store, {
                    homeInfo: homescreenInfo.homes,
                    totalHomes: homescreenInfo.homes.length,
                    totalLocations: getTotalRegisteredLocationsForHomescreen(homescreenInfo.homes),
                    totalDevices: getTotalRegisteredDevicesForHomescreen(homescreenInfo.homes),
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'get-view-homescreen-info' as HomescreenActions,
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
                errorNotification: 'get-view-homescreen-info' as HomescreenActions,
              });
              return EMPTY;
            }

            return registrationService
              .registerHome({ parentEntityId: userId, name: homeName })
              .pipe(
                tapResponse({
                  next: () =>
                    patchState(store, {
                      successNotification: 'register-home' as HomescreenActions,
                    }),
                  error: () =>
                    patchState(store, {
                      errorNotification: 'register-home' as HomescreenActions,
                    }),
                }),
              );
          }),
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
                    const homes: IHome[] = state.homeInfo
                      ? state.homeInfo.filter((home) => home.homeId !== response.homeId)
                      : [];

                    return {
                      homeInfo: homes,
                      totalHomes: homes.length,
                      totalLocations: getTotalRegisteredLocationsForHomescreen(homes),
                      totalDevices: getTotalRegisteredDevicesForHomescreen(homes),
                      successNotification: 'delete-home' as HomescreenActions,
                    };
                  }),
                error: () =>
                  patchState(store, {
                    errorNotification: 'delete-home' as HomescreenActions,
                  }),
              }),
            ),
          ),
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

function getTotalRegisteredLocationsForHomescreen(homes: IHome[]): number {
  let totalLocations = 0;
  homes.forEach((home) => {
    totalLocations += home.totalLocations;
  });

  return totalLocations;
}

function getTotalRegisteredDevicesForHomescreen(homes: IHome[]): number {
  let totalDevices = 0;
  homes.forEach((home) => {
    totalDevices += home.totalDevices;
  });

  return totalDevices;
}
