import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import {
  HOME_PAGE_ROUTE,
  LOGIN_ROUTE,
  REGISTER_HOME_ROUTE,
  REGISTER_USER_ROUTE,
  VIEW_DEVICE,
  VIEW_HOME,
  VIEW_LOCATION,
} from './constants/navigation-constants';
import { HomePage } from './home-page/home-page';
import { RegisterUser } from './registration/user/register-user/register-user';
import { ViewHome } from './home/view-home/view-home';
import { ViewDevice } from './device/view-device/view-device';
import { ViewLocation } from './location/view-location/view-location';
import { LoadingComponent } from './loading-component/loading-component';
import { isUserAuthenticated } from './guards/auth.guard';
import { RegisterHome } from './registration/home/register-home/register-home';

export const routes: Routes = [
  {
    path: HOME_PAGE_ROUTE,
    component: HomePage,
    canActivate: [isUserAuthenticated],
  },
  {
    path: LOGIN_ROUTE,
    component: LoginComponent,
  },
  {
    path: REGISTER_USER_ROUTE,
    component: RegisterUser,
  },
  {
    path: REGISTER_HOME_ROUTE,
    component: RegisterHome,
  },
  {
    path: VIEW_HOME + '/:homeId',
    component: ViewHome,
  },
  {
    path: VIEW_LOCATION + '/:locationId',
    component: ViewLocation,
  },
  {
    path: VIEW_DEVICE + '/:deviceId',
    component: ViewDevice,
  },
  {
    path: 'loadingMessage',
    component: LoadingComponent,
  },
];
