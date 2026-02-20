import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { HomePage } from './home-page/home-page';
import { RegisterUser } from './registration/user/register-user/register-user';
import { ViewHome } from './home/view-home/view-home';
import { ViewDevice } from './device/view-device/view-device';
import { ViewLocation } from './location/view-location/view-location';
import { RegisterHome } from './registration/home/register-home/register-home';
import { RegisterLocation } from './registration/location/register-location/register-location';
import { RegisterDevice } from './registration/device/register-device/register-device';
import { isUserAuthenticated } from './guards/auth.guard';
import {
  CAPTIVE_ERROR_ROUTE,
  HOME_PAGE_ROUTE,
  LOGIN_ROUTE,
  REGISTER_DEVICE_ROUTE,
  REGISTER_HOME_ROUTE,
  REGISTER_LOCATION_ROUTE,
  REGISTER_USER_ROUTE,
  VIEW_HOME_ROUTE,
  VIEW_LOCATION_ROUTE,
  VIEW_DEVICE_ROUTE,
  SETTINGS_ROUTE,
  ABOUT_ROUTE,
  ROOT_ROUTE,
} from './constants/navigation-constants';
import { CaptiveError } from './captive-error/captive-error';
import { Settings } from './menu-items/settings/settings';
import { About } from './menu-items/about/about';

export const routes: Routes = [
  {
    path: ROOT_ROUTE,
    canActivate: [isUserAuthenticated],
    children: [
      { path: HOME_PAGE_ROUTE, component: HomePage },
      {
        path: REGISTER_HOME_ROUTE,
        component: RegisterHome,
      },
      {
        path: REGISTER_LOCATION_ROUTE + '/:homeId',
        component: RegisterLocation,
      },
      {
        path: REGISTER_DEVICE_ROUTE + '/:locationId',
        component: RegisterDevice,
      },
      {
        path: VIEW_HOME_ROUTE + '/:homeId',
        component: ViewHome,
      },
      {
        path: VIEW_LOCATION_ROUTE + '/:locationId',
        component: ViewLocation,
      },
      {
        path: VIEW_DEVICE_ROUTE + '/:deviceId',
        component: ViewDevice,
      },
      {
        path: SETTINGS_ROUTE,
        component: Settings,
      },
      {
        path: ABOUT_ROUTE,
        component: About,
      },
    ],
  },
  {
    path: LOGIN_ROUTE,
    component: LoginComponent,
  },
  {
    path: REGISTER_USER_ROUTE,
    component: RegisterUser,
  },
  { path: CAPTIVE_ERROR_ROUTE, component: CaptiveError },
];
