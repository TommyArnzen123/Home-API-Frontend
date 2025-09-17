import { Routes } from '@angular/router';
import { HomeLoginController } from './login-controller/home-login-controller';
import { LoginComponent } from './login-component/login-component';
import {
  APP_ROOT_ROUTE,
  HOME_PAGE_ROUTE,
  LOGIN_ROUTE,
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

export const routes: Routes = [
  {
    path: APP_ROOT_ROUTE,
    component: HomeLoginController,
  },
  {
    path: LOGIN_ROUTE,
    component: LoginComponent,
  },
  {
    path: HOME_PAGE_ROUTE,
    component: HomePage,
  },
  {
    path: REGISTER_USER_ROUTE,
    component: RegisterUser,
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
];
