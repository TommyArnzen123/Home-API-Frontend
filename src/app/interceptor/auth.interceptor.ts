import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login';
import { EntityStore } from '../store/entity.store';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const entityStore = inject(EntityStore);
  const jwtToken = entityStore.jwtToken();

  if (!jwtToken) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${jwtToken}` },
    }),
  );
};
