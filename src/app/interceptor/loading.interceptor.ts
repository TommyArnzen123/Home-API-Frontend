import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingContextToken, SkipLoadingContextToken } from './http-context-tokens';

export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (req.context.get(SkipLoadingContextToken)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);

  const loadingContextToken = req.context.get(LoadingContextToken);

  if (loadingContextToken) {
    loadingService.loadingOn(loadingContextToken);
  } else {
    loadingService.loadingOn('');
  }

  return next(req).pipe(
    finalize(() => {
      loadingService.loadingOff();
    }),
  );
};
