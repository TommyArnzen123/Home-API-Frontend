import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment';
import {
  IRegisterGenericEntityRequest,
  IRegisterGenericEntityResponse,
  IRegisterUserRequest,
} from '../model/registration';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { IEditGenericEntityResponse, IEditHomeRequest } from '../model/edit';
import { IHome } from '../model/get-info';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  private editRoot = '/edit';
  private editUserPath = '/user';
  private editHomePath = '/home';
  private editLocationPath = '/location';
  private editDevicePath = '/device';

  //   editUser(
  //     registerUserRequest: IRegisterUserRequest,
  //   ): Observable<IRegisterGenericEntityResponse> {
  //     return this.httpClient.post<IRegisterGenericEntityResponse>(
  //       this.environmentService.getEnvironment().backendUrl +
  //         this.registrationRoot +
  //         this.registerUserPath,
  //       registerUserRequest,
  //       { context: new HttpContext().set(LoadingContextToken, 'Registering new user') },
  //     );
  //   }

  editHome(editHomeRequest: IEditHomeRequest): Observable<IEditGenericEntityResponse> {
    return this.httpClient.put<IEditGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl + this.editRoot + this.editHomePath,
      editHomeRequest,
      {
        context: new HttpContext().set(LoadingContextToken, 'Editing home'),
      },
    );
  }

  //   editLocation(
  //     registerLocationRequest: IRegisterGenericEntityRequest,
  //   ): Observable<IRegisterGenericEntityResponse> {
  //     return this.httpClient.post<IRegisterGenericEntityResponse>(
  //       this.environmentService.getEnvironment().backendUrl +
  //         this.registrationRoot +
  //         this.registerLocationPath,
  //       registerLocationRequest,
  //       {
  //         context: new HttpContext().set(LoadingContextToken, 'Registering new location'),
  //       },
  //     );
  //   }

  //   editDevice(
  //     registerDeviceRequest: IRegisterGenericEntityRequest,
  //   ): Observable<IRegisterGenericEntityResponse> {
  //     return this.httpClient.post<IRegisterGenericEntityResponse>(
  //       this.environmentService.getEnvironment().backendUrl +
  //         this.registrationRoot +
  //         this.registerDevicePath,
  //       registerDeviceRequest,
  //       {
  //         context: new HttpContext().set(LoadingContextToken, 'Registering new device'),
  //       },
  //     );
  //   }
}
