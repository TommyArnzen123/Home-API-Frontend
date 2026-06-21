import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment';
import { LoadingContextToken } from '../interceptor/http-context-tokens';
import { IConfirmEmailRequest, IEmailConfirmationCode } from '../model/confirm-email';

@Injectable({
  providedIn: 'root',
})
export class ConfirmEmailService {
  private readonly httpClient = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  private confirmEmailRoot = '/confirmEmail';
  private generateEmailConfirmationCodePath = '/generateEmailConfirmationCode';
  private confirmCodePath = '/confirmCode';

  generateEmailConfirmationCode(userId: number): Observable<IEmailConfirmationCode> {
    return this.httpClient.get<IEmailConfirmationCode>(
      this.environmentService.getEnvironment().backendUrl +
        this.confirmEmailRoot +
        this.generateEmailConfirmationCodePath +
        '/' +
        userId,
      {
        context: new HttpContext().set(LoadingContextToken, 'Sending verification email'),
      },
    );
  }

  confirmEmail(confirmationRequest: IConfirmEmailRequest): Observable<void> {
    return this.httpClient.post<void>(
      this.environmentService.getEnvironment().backendUrl +
        this.confirmEmailRoot +
        this.confirmCodePath,
      confirmationRequest,
      {
        context: new HttpContext().set(LoadingContextToken, 'Verifying email address'),
      },
    );
  }
}
