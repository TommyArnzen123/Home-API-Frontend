import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const jwtToken = loginService.getJwtToken();

  if (!jwtToken) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${jwtToken}` },
    }),
  );
};
