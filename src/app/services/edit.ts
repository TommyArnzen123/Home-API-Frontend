import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import {
  IEditDeviceRequest,
  IEditGenericEntityResponse,
  IEditHomeRequest,
  IEditLocationRequest,
} from '../model/edit';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  private editRoot = '/edit';
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

  editLocation(editLocationRequest: IEditLocationRequest): Observable<IEditGenericEntityResponse> {
    return this.httpClient.put<IEditGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl + this.editRoot + this.editLocationPath,
      editLocationRequest,
      {
        context: new HttpContext().set(LoadingContextToken, 'Editing location'),
      },
    );
  }

  editDevice(editDeviceRequest: IEditDeviceRequest): Observable<IEditGenericEntityResponse> {
    return this.httpClient.put<IEditGenericEntityResponse>(
      this.environmentService.getEnvironment().backendUrl + this.editRoot + this.editDevicePath,
      editDeviceRequest,
      {
        context: new HttpContext().set(LoadingContextToken, 'Editing device'),
      },
    );
  }
}
