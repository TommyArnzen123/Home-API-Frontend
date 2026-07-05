import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login';
import { LOGIN_ROUTE } from '../constants/navigation-constants';
import { EntityStore } from '../store/entity.store';

export const isUserAuthenticated: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const entityStore = inject(EntityStore);
  const isLoggedIn = entityStore.userInitialized();
  const router = inject(Router);

  if (isLoggedIn) {
    return true;
  } else {
    return router.parseUrl(LOGIN_ROUTE);
  }
};
