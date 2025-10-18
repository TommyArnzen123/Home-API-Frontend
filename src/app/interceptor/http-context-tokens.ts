import { HttpContextToken } from '@angular/common/http';

export const SkipLoadingContextToken = new HttpContextToken<boolean>(() => false);
export const LoadingContextToken = new HttpContextToken<string>(() => '');
