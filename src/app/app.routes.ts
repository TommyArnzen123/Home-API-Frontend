import { Routes } from '@angular/router';
import { HomeLoginController } from './login-controller/home-login-controller';
import { LoginComponent } from './login-component/login-component';
import { APP_ROOT_ROUTE, HOME_PAGE_ROUTE, LOGIN_ROUTE, REGISTER_USER_ROUTE } from './constants/navigation-constants';
import { HomePage } from './home-page/home-page';
import { RegisterUser } from './registration/user/register-user/register-user';

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
        component: HomePage
    },
    {
        path: REGISTER_USER_ROUTE,
        component: RegisterUser
    }
];
