import { Routes } from '@angular/router';
import { HomeLoginController } from './login-controller/home-login-controller';
import { LoginComponent } from './login-component/login-component';
import { APP_ROOT_ROUTE, HOME_PAGE_ROUTE, LOGIN_ROUTE } from './constants/navigation-constants';
import { HomePage } from './home-page/home-page';

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
    }
];
